import { useDialog } from '@/context/DialogProvider';
import { useDivideStore } from '@/store/order/divide/divide.slice';
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

import CustomOrderItem from './CustomOrderItem';

interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, numSelected, rowCount } =
        props;


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
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                <TableCell component="th" align='center'>Nro.</TableCell>
                <TableCell component="th" align='center'>Descripción</TableCell>
                <TableCell component="th" align='center'>Cantidad</TableCell>
                <TableCell component="th" align='center'>Precio con IVA</TableCell>
                <TableCell component="th" align='center'>Total</TableCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;

    selected: readonly number[]
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {

    const [openDialog, closeDialog,] = useDialog();

    const { numSelected, selected } = props;

    const openCustomOrderItemDialog = () => {
        openDialog({
            maxWidth: 'md',
            children: <CustomOrderItem close={closeDialog} />
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
                            <Button variant='contained' color='info' size='large' onClick={openCustomOrderItemDialog} >
                                Personalizado
                            </Button>
                            <Button variant='contained' size='large'  >
                                Factura
                            </Button>
                            <Button variant='contained' color='warning' size='large' >
                                Nota Entrega
                            </Button>

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

    const { orderData } = useDivideStore(state => state);
    const [selected, setSelected] = React.useState<readonly number[]>([]);



    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = orderData.order.items.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_: React.MouseEvent<unknown>, id: number) => {
        console.log(id)
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
    };



    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    console.log(selected)

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} />

                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={orderData.order.items.length}
                        />
                        <TableBody>
                            {orderData.order.items.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        // hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">{row.descripcion}</TableCell>
                                        <TableCell align="center">{row.quantity}</TableCell>
                                        <TableCell align="center">{ccyFormat(row.precioConIVA)}</TableCell>
                                        <TableCell align="center">{ccyFormat(row.total)}</TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow>
                                <TableCell colSpan={4} align='right'></TableCell>
                                <TableCell align='center' sx={{ fontWeight: 700 }}>Total: </TableCell>
                                <TableCell align="center">{ccyFormat(orderData.order.total)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
