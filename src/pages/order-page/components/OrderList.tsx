import { ClearIcon, InsertDriveFileIcon, MenuIcon, ModeTwoToneIcon, PointOfSaleIcon } from '@/components/common/IconsMaterial'
import PrimaryStatusTable from '@/components/ui/PrimaryStatusTable'
import { StyledTableCell } from '@/components/ui/StyledTableCell'
import { useDialog } from '@/context/DialogProvider'
import { OrderRead } from '@/models/order.model'
import { DIVIDE_STATUS_REFRESH } from '@/store/order/divide/divide.type'
import { useOrderStore } from '@/store/order/order.slice'
import { ccyFormat } from '@/utils/utils'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react'

import Divide from './divide/Divide'
import OrderDoc from './OrderDoc'

interface AnchorElState {
    [key: string]: HTMLElement | null;
}


const OrderList = () => {
    const [openDialog, closeDialog,] = useDialog();
    const { orders, getOrders } = useOrderStore(state => state);
    // Define un estado para almacenar el ancla del menú para cada fila
    const [anchorEl, setAnchorEl] = useState<AnchorElState>({});

    // Handler para abrir el menú de una fila específica
    const handleClick = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
        setAnchorEl({ ...anchorEl, [orderId]: event.currentTarget });
    };

    // Handler para cerrar el menú de una fila específica
    const handleClose = (orderId: string) => {
        setAnchorEl({ ...anchorEl, [orderId]: null });
    };

    /**
   * =============START DIVIDE====================
   */
    const openModalDivide = (item: OrderRead) => {
        handleClose(item.uuid)
        openDialog({
            maxWidth: "lg",
            fullScreen: true,
            children: <Divide close={closeDialogDivide} orderId={item.id} />,
        })
    }
    function closeDialogDivide<T>(data: T) {
        closeDialog()
        if (data === DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST) {
            getOrders();
        }
    }
    /**
     * =============END DIVIDE====================
     */

    const btnDivided = (order: OrderRead) => {
        if (order.finished) return

        if (order.divided && order.finished) return
        // if (order.divided && order.finished === false) return

        return (
            <MenuItem onClick={() => openModalDivide(order)}>
                <PointOfSaleIcon color='primary' />
                Completar venta
            </MenuItem>
        )
    }

    function openModalDoc(id: number, item: OrderRead) {
        handleClose(item.uuid)
        openDialog({
            maxWidth: 'md',
            children: <OrderDoc id={id} data={item} close={() => closeDialog()} />,
        })
    }

    const optionMenu = (item: OrderRead) => {
        return <>
            <TableCell component="th" scope="row">
                <IconButton
                    id={`button-option-${item.uuid}`}
                    aria-controls={anchorEl[item.uuid] ? `basic-menu-${item.uuid}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl[item.uuid] ? 'true' : undefined}
                    onClick={(event) => handleClick(event, item.uuid)}
                >
                    <MenuIcon />
                </IconButton>

                <Menu
                    id={`button-option-${item.uuid}`}
                    anchorEl={anchorEl[item.uuid]}
                    open={Boolean(anchorEl[item.uuid])}
                    onClose={() => handleClose(item.uuid)}
                >
                    <MenuItem onClick={() => openModalDoc(item.id, item)}>
                        <InsertDriveFileIcon color='info' />
                        Docs.
                    </MenuItem>
                    <MenuItem  >
                        <ModeTwoToneIcon color='success' />
                        Editar
                    </MenuItem>
                    {btnDivided(item)}
                    <MenuItem  >
                        <ClearIcon color='error' />
                        Anular
                    </MenuItem>
                </Menu>

            </TableCell>

        </>
    }
    return (
        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
                <TableHead >
                    <TableRow>
                        <StyledTableCell>Op.</StyledTableCell>
                        <StyledTableCell>N°.</StyledTableCell>
                        <StyledTableCell>Nro. Documento</StyledTableCell>
                        <StyledTableCell>Fecha Emisión</StyledTableCell>
                        <StyledTableCell>Cliente</StyledTableCell>
                        <StyledTableCell>Total</StyledTableCell>
                        <StyledTableCell>Mesa</StyledTableCell>
                        <StyledTableCell>Usuario</StyledTableCell>
                        <StyledTableCell>Estado</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        orders.map((item, index) => (
                            <TableRow key={index}>
                                {optionMenu(item)}
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.serie}</TableCell>
                                <TableCell>{item.createdAt}</TableCell>
                                <TableCell>{item.razonSocialComprador}</TableCell>
                                <TableCell>{ccyFormat(item.total)}</TableCell>
                                <TableCell>{item.tableName}</TableCell>
                                <TableCell>{item.userName}</TableCell>
                                <TableCell>
                                    <PrimaryStatusTable status={item.enabled} />
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    {
                        orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align='center'>
                                    No hay datos
                                </TableCell>
                            </TableRow>
                        )
                    }

                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default OrderList