import { FileDownloadIcon, MenuIcon, PaymentIcon, PrintIcon, SaveAltSharpIcon, WhatsAppIcon } from '@/components/common/IconsMaterial'
import Payment from '@/components/payment/Payment'
import SendWhatsapp from '@/components/send-whatsapp/SendWhatsapp'
import DialogHeader from '@/components/ui/DialogHeader'
import { StyledTableCell } from '@/components/ui/StyledTableCell'
import { CODE_REPORT, DOC_TYPE } from '@/constants/constants'
import { useDialog } from '@/context/DialogProvider'
import { OrderDocRaw } from '@/models/order-doc.model'
import { OrderRead } from '@/models/order.model'
import { orderSvc } from '@/services/order.service'
import { sharedSvc } from '@/services/shared.service'
import { hideLoader, showLoader } from '@/utils/loader'
import { ccyFormat } from '@/utils/utils'
import { Button, DialogActions, DialogContent, Grid, IconButton, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

interface AnchorElState {
    [key: string]: HTMLElement | null;
}
type OrderDocProps = {
    id: number
    data: OrderRead
    close<T>(data?: T): void
}
const OrderDoc = ({ id, data, close }: OrderDocProps) => {
    const [openDialog, closeDialog] = useDialog();

    const [orderDocs, setOrderDocs] = useState<Array<OrderDocRaw>>([]);

    // Define un estado para almacenar el ancla del menú para cada fila
    const [anchorEl, setAnchorEl] = useState<AnchorElState>({});

    // Handler para abrir el menú de una fila específica
    const handleClick = (event: React.MouseEvent<HTMLElement>, documentoId: number) => {
        setAnchorEl({ ...anchorEl, [documentoId]: event.currentTarget });
    };

    // Handler para cerrar el menú de una fila específica
    const handleClose = (documentoId: number) => {
        setAnchorEl({ ...anchorEl, [documentoId]: null });
    };


    useEffect(() => {
        showLoader();
        orderSvc.getOrderDocs(id).then(response => {
            setOrderDocs(response)
        }).catch(error => {
            console.log(error)
        }).finally(() => hideLoader())


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const openModalSendWhatsApp = (data: OrderDocRaw) => {
        handleClose(data.documentoId);
        openDialog({
            maxWidth: 'sm',
            children: <SendWhatsapp close={() => closeDialog()} data={data} />
        })
    }

    const openModalPayment = (data: OrderDocRaw) => {
        if (["A"].includes(data.codEstado)) {
            Swal.fire({
                icon: 'warning',
                html: 'Este documento ya esta anulado!'
            })
        }

        if (["CBR"].includes(data.codEstado)) {
            Swal.fire({
                icon: 'warning',
                html: 'Este documento ya ha sido cobrado!'
            })
            return
        }
        handleClose(data.documentoId);
        openDialog({
            maxWidth: 'xl',
            fullScreen: true,
            children: <Payment close={() => closeDialog()} data={data} />
        })
    }
    const printOrder = () => {
        try {
            sharedSvc.askToPrint({
                id,
                documentoId: 0,
                tipo: 2
            })
        } catch (error) {
            console.log(error)
        }
    }

    const reportOrderPDF = async () => {
        const parameters = {
            dataParams: JSON.stringify({
                id: id
            }),
            reportParams: JSON.stringify({
                codEstab: data.codEstab,
                codigo: CODE_REPORT.OR,
                format: "pdf",
            }),
        };
        sharedSvc.downloadExternal(parameters)
    };

    const sendWhatsAppOrder = () => {
        openDialog({
            maxWidth: 'sm',
            children: <SendWhatsapp close={() => closeDialog()} data={{
                telefono: data.telefonoCliente,
                docType: DOC_TYPE.OR,
                codEstab: data.codEstab,
                telefonoEstablecimiento: data.telefonoEstablecimiento,
                nombreComercial: data.nombreComercialEstab,
                documentoId: id
            }} />
        })
    }

    //Documents
    const documentReport = (orderDoc: OrderDocRaw) => {
        try {
            const format = 'pdf';
            const dataParms = {
                id: orderDoc.documentoId,
                //Factura
                format,
                codEstab: data.codEstab,
            }

            if (orderDoc.docType === DOC_TYPE.NE) {
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: CODE_REPORT.NE,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                }
                sharedSvc.downloadExternal(parameters, false, true);
                return
            }

            if (orderDoc.docType === DOC_TYPE.FV) {
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: CODE_REPORT.FV,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                }
                sharedSvc.downloadExternal(parameters, false, true)
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    const documentPrint = (orderDoc: OrderDocRaw) => {
        try {
            if (orderDoc.docType === DOC_TYPE.NE) {
                sharedSvc.askToPrint({
                    id: orderDoc.orderId,
                    documentoId: orderDoc.documentoId,
                    tipo: 4
                })
                return
            }
            if (orderDoc.docType === DOC_TYPE.FV) {
                sharedSvc.askToPrint({
                    id: orderDoc.orderId,
                    documentoId: orderDoc.documentoId,
                    tipo: 3
                })
                return
            }

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <>
            <DialogHeader title='Documentos Relacionados' close={() => close()} />
            <DialogContent dividers>
                <Grid container>
                    <Grid item xl={10} lg={10} md={10} sm={10} xs={6}>
                        <Typography variant="subtitle1" component="div">
                            Detalle del pedido
                        </Typography>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={700} >Nro. Comprobante:</Typography>
                                    </td>
                                    <td>
                                        <Typography variant="subtitle2" gutterBottom color="text.secondary"> {data.serie}</Typography>

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={700} >Fecha Emisión:</Typography>
                                    </td>
                                    <td>
                                        <Typography variant="subtitle2" gutterBottom color="text.secondary"> {data.createdAt}</Typography>

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={700} >Total:</Typography>
                                    </td>
                                    <td>
                                        <Typography variant="subtitle2" gutterBottom color="text.secondary"> {ccyFormat(data.total)}</Typography>

                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </Grid>
                    <Grid item xl={2} lg={2} md={2} sm={2} xs={6}>
                        <Stack spacing={1} direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'column' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size='medium'
                                onClick={printOrder}
                                startIcon={<PrintIcon />}
                            >
                                
                                <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
                                    Imprimir

                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="info"
                                size='medium'
                                onClick={reportOrderPDF} startIcon={
                                    <SaveAltSharpIcon />} >
                                <Typography variant='body2' sx={{ display: { xs: 'none', md: 'block' } }}>
                                    PDF
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color='success'
                                size='medium'
                                onClick={sendWhatsAppOrder}
                                fullWidth startIcon={  <WhatsAppIcon />} >
                                <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
                                    WhatsApp 
                                </Typography>
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='center'>Op.</StyledTableCell>
                                <StyledTableCell>N°.</StyledTableCell>
                                <StyledTableCell>Tipo Doc.</StyledTableCell>
                                <StyledTableCell>Nro. Doc.</StyledTableCell>
                                <StyledTableCell>Fecha Emisión</StyledTableCell>
                                <StyledTableCell>Cliente</StyledTableCell>
                                <StyledTableCell align="right">Total</StyledTableCell>
                                <StyledTableCell align="right">Abono</StyledTableCell>
                                <StyledTableCell align="right">Saldo</StyledTableCell>
                                <StyledTableCell>Estado</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderDocs.map((item, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <IconButton
                                            id={`basic-button-${item.documentoId}`}
                                            aria-controls={anchorEl[item.documentoId] ? `basic-menu-${item.documentoId}` : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={anchorEl[item.documentoId] ? 'true' : undefined}
                                            onClick={(event) => handleClick(event, item.documentoId)}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                        <Menu
                                            id={`basic-menu-${item.documentoId}`}
                                            anchorEl={anchorEl[item.documentoId]}
                                            open={Boolean(anchorEl[item.documentoId])}
                                            onClose={() => handleClose(item.documentoId)}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={() => documentPrint(item)}>
                                                <PrintIcon />
                                                Imprimir
                                            </MenuItem>
                                            <MenuItem onClick={() => documentReport(item)}>
                                                <FileDownloadIcon />
                                                Reporte
                                            </MenuItem>
                                            <MenuItem onClick={() => openModalSendWhatsApp(item)}>
                                                <WhatsAppIcon />
                                                WhatsApp
                                            </MenuItem>
                                            <MenuItem onClick={() => openModalPayment(item)}>
                                                <PaymentIcon />
                                                Cobro
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>{item.docType}</TableCell>
                                    <TableCell>{item.serie}</TableCell>
                                    <TableCell>{item.createAt}</TableCell>
                                    <TableCell>{item.customerName}</TableCell>
                                    <TableCell align="right">{ccyFormat(item.importeTotal)}</TableCell>
                                    <TableCell align="right">{ccyFormat(item.abono)}</TableCell>
                                    <TableCell align="right">{ccyFormat(item.saldo)}</TableCell>
                                    <TableCell>{item.estado}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button color='inherit' variant='outlined' size='large' fullWidth onClick={() => close()}>
                    Cerrar
                </Button>
            </DialogActions>
        </>
    )
}

export default OrderDoc