import { useDivideStore } from "@/store/order/divide/divide.slice";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function EnhancedTableHead() {
    const { orderDivideItems, selected, handleSelectAllClick } = useDivideStore(state => state);
    const numSelected = selected.length;
    const rowCount = orderDivideItems.length;
    const isUnchangedQuantity = orderDivideItems.every(i => i.paid && i.remainingQuantityReal === 0);


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
                        onChange={handleSelectAllClick}
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
export default EnhancedTableHead;