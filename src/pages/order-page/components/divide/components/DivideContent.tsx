import ErrorBoundary from '@/components/common/ErrorBoundary';
import { EditNoteIcon, NextPlanIcon } from '@/components/common/IconsMaterial';
import { useDialog } from '@/context/DialogProvider';
import { useDivideStore } from '@/store/order/divide/divide.slice';
import { OrderItemDivide } from '@/store/order/divide/divide.type';
import { pricingCalculateUtil } from '@/utils/pricing-calculate.util';
import { notify, ToastType } from '@/utils/toastify/toastify.util';
import { ccyFormat } from '@/utils/utils';
import { Button, Divider, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';

import ConvertToDocDialog from './ConvertToDocDialog';
import CustomOrderItem from './CustomOrderItem';
import InputRemainingQuantity from './InputRemainingQuantity';

interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { orderDivideItems } = useDivideStore(state => state);
    const { onSelectAllClick, numSelected, rowCount } = props;
    const isUnchangedQuantity = orderDivideItems.every(i => i.paid && i.remainingQuantityReal ===0);


    return (
        <TableHead>
            <TableRow sx={{
                "& th": {
                    fontWeight: 600,
                    fontSize: '0.875rem'
                }
            }}>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        disabled={isUnchangedQuantity}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                <TableCell component="th" align='center'>Nro.</TableCell>
                <TableCell component="th" align='center'>Código</TableCell>
                <TableCell component="th" align='center'>Descripción</TableCell>
                <TableCell component="th" align='center'>Cantidad Real</TableCell>
                <TableCell component="th" align='center'>Cantidad</TableCell>
                <TableCell component="th" align='center'>Precio incluido IVA</TableCell>
                <TableCell component="th" align='center'>Total</TableCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    rowCount: number
    selected: readonly number[]
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { orderDivideItems } = useDivideStore(state => state);

    const [openDialog, closeDialog,] = useDialog();
    const isUnchangedQuantity = orderDivideItems.every(i => (i.remainingQuantity || 0) > 0 && i.quantity === (i.remainingQuantity || 0));

    const { numSelected, selected, rowCount } = props;

    const openCustomOrderItemDialog = () => {
        openDialog({
            maxWidth: 'md',
            children: <CustomOrderItem close={closeDialog} />
        })
    }

    const openConvertToDocDialog = () => {
        if (selected.length === 0) {
            notify({
                type: ToastType.Warning,
                content: 'Seleccione al menos un item'
            })
            return
        }
        openDialog({
            maxWidth: 'xs',
            children: <ConvertToDocDialog close={closeDialog} selected={selected} />
        })
    }


    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                // ...(numSelected > 0 && {
                //     bgcolor: (theme) =>
                //         alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                // }),
            }}
        >
            {numSelected > 0 ? (
                <Typography

                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {`${numSelected} ${numSelected === 1 ? 'Seleccionado' : 'Seleccionados'}`}
                </Typography>
            ) : ''}
            <Box sx={{ flexGrow: 1 }} />
            {
                numSelected > 0 ? (

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Stack spacing={1} direction="row">
                            {
                                rowCount === numSelected && isUnchangedQuantity && (
                                    <Button variant='contained' color='info' size='large' onClick={openCustomOrderItemDialog} >
                                        <EditNoteIcon /> Personalizado
                                    </Button>
                                )
                            }
                            <Button variant='contained' size='large' color='success' onClick={openConvertToDocDialog} >
                                <NextPlanIcon /> Continuar
                            </Button>
                            {/* <Button variant='contained' color='warning' size='large' >
                                Nota Entrega
                            </Button> */}

                        </Stack>
                    </Box>
                ) : ''
            }


            {/* {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )} */}
        </Toolbar>
    );
}




export default function DivideContent() {

    const { orderData, setOrderDivideItem, orderDivideItems, cloneOrderDivideItems } = useDivideStore(state => state);
    const [selected, setSelected] = React.useState<readonly number[]>([]);



    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = orderDivideItems.filter(item => (item.remainingQuantity || 0) > 0 && !(item.paid)).map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
        setOrderDivideItem(cloneOrderDivideItems)
    };

    const handleClick = (id: number) => {

        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        if (selected.length === 0) {
            setOrderDivideItem(cloneOrderDivideItems)
        }
    };



    const isSelected = (id: number) => selected.indexOf(id) !== -1;
 

    const changeInputQuantity = (qty: number, uuid: string) => {
        const updatedItems = orderDivideItems.map(item => {
            if (item.uuid === uuid) {
                const updatedItem = {
                    ...item,
                    remainingQuantity: qty,
                };
                return updatedItem;
            }
            return item;
        })
        setOrderDivideItem(updatedItems)
    }


    const getItemDivideTotal = (item: OrderItemDivide) => {
        const precioTotalSinImpuesto = ((item.price * (item.remainingQuantity || 0))) - item.discount;
        const valorImpuesto = pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, item.taxPercent);
        const total = precioTotalSinImpuesto + valorImpuesto;
        return total;
    }


    const orderDivideImporteTotal = orderDivideItems.reduce((acc, prev) => {
        if (selected.some(s => s === prev.id)) {
            acc += getItemDivideTotal(prev);
        }
        return acc;
    }, 0);

    return (
        <ErrorBoundary fallBackComponent={<>Error load component</>}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} rowCount={orderDivideItems.length} selected={selected} />

                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                onSelectAllClick={handleSelectAllClick}
                                rowCount={orderDivideItems.length}
                            />
                            <TableBody >
                                {orderDivideItems.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                           
                                    return (
                                        <TableRow
                                            style={{ backgroundColor: 'transparent' }}
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}

                                            selected={isItemSelected}
                                        // disabled={!(row.remainingQuantity === 0 && row.paid)}
                                        //     sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    onChange={() => handleClick(row.id)}
                                                    disabled={(row.remainingQuantity === 0 && row.paid)}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="center">{row.code}</TableCell>
                                            <TableCell align="center">{row.descripcion}</TableCell>
                                            <TableCell align="center">{row.quantity}</TableCell>

                                            <TableCell align="center" width={115}>
                                                {
                                                    isItemSelected && row.quantity > 0 ? (
                                                        <InputRemainingQuantity item={row} changeInputQuantity={(qty) => changeInputQuantity(qty, row.uuid)} />

                                                    ) : row.remainingQuantity

                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {ccyFormat(row.precioConIVA, 3)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack divider={<Divider orientation="horizontal" flexItem />}>
                                                    <Typography variant="body2" gutterBottom>
                                                        {ccyFormat(row.total)}
                                                    </Typography>
                                                    {
                                                        isItemSelected ? (
                                                            <Typography variant="body1" color="primary" fontWeight={700}>
                                                                {ccyFormat(getItemDivideTotal(row))}
                                                            </Typography>
                                                        ) : null
                                                    }
                                                </Stack>

                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {
                                    selected.length > 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align='right'></TableCell>
                                            <TableCell colSpan={2} align='center' sx={{ fontWeight: 700 }}>Importe Total División: </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="subtitle1" color="primary" fontWeight={700}>
                                                    {ccyFormat(orderDivideImporteTotal)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : null
                                }
                                <TableRow>
                                    <TableCell colSpan={5} align='right'></TableCell>
                                    <TableCell colSpan={2} align='center' sx={{ fontWeight: 700 }}>Importe Total Pedido: </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="h6" gutterBottom>
                                            {ccyFormat(orderData.order.total)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </ErrorBoundary>
    );
}
