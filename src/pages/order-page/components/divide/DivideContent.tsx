import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useDivideStore } from '@/store/order/divide/divide.slice';
import { OrderItemDivide } from '@/store/order/divide/divide.type';
import { pricingCalculateUtil } from '@/utils/pricing-calculate.util';
import { ccyFormat } from '@/utils/utils';
import { Divider, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import EnhancedTableHead from './components/EnhancedTableHead';
import EnhancedTableToolbar from './components/EnhancedTableToolbar';
import InputRemainingQuantity from './components/InputRemainingQuantity';

export default function DivideContent() {

    const {
        orderData,
        setOrderDivideItem,
        orderDivideItems,
        cloneOrderDivideItems,
        selected,
        setSelected
    } = useDivideStore(state => state);


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
                    <EnhancedTableToolbar />

                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead />
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
