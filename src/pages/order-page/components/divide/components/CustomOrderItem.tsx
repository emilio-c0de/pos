import { orderAdapter } from '@/adapters/order.adapter'
import CompanyCustomerSearch from '@/components/company-customer/CompanyCustomerSearch'
import Payment from '@/components/payment/Payment'
import ProductSearch from '@/components/product/ProductSearch'
import DialogHeader from '@/components/ui/DialogHeader'
import { StyledTableCell } from '@/components/ui/StyledTableCell'
import { DOC_TYPE, ITEM_TYPE_CODE } from '@/constants/constants'
import { useDialog } from '@/context/DialogProvider'
import { OrderItem, OrderToSaveReturnData } from '@/models/order.model'
import { productSvc } from '@/services/external/product.service'
import { orderSvc } from '@/services/order.service'
import { useDivideStore } from '@/store/order/divide/divide.slice'
import { DIVIDE_STATUS_REFRESH } from '@/store/order/divide/divide.type'
import { useSharedStore } from '@/store/pos/shared.slice'
import { generateUuidv4 } from '@/utils/generate-uuidv4'
import { hideLoader, showLoader } from '@/utils/loader'
import { pricingCalculateUtil } from '@/utils/pricing-calculate.util'
import { roundNumber } from '@/utils/round-number.util'
import { notify, ToastType } from '@/utils/toastify/toastify.util'
import { ccyFormat, getPrinterFactura, isValidField } from '@/utils/utils'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import { produce } from 'immer'
import { useState } from 'react'
import Swal from 'sweetalert2'

type CustomOrderItemProps = {
    close(): void
}

const CustomOrderItem = ({ close }: CustomOrderItemProps) => {
    const [openDialog, closeDialog] = useDialog();

    const { orderData, setRefreshOrderList } = useDivideStore(state => state);
    const { dataFormPos } = useSharedStore(state => state);

    const [customOrderItems, setCustomOrderItems] = useState<OrderItem[]>(orderData.order.items);
    const [data, setData] = useState({
        customerCompanyId: orderData.order.customerCompanyId,
        customerName: orderData.order.customerName,
        description: '',
        obs: ''
    });


    function setChangeField<T extends keyof typeof data>(
        prop: T,
        value: typeof data[T]
    ) {
        setData(
            produce((state) => {
                state[prop] = value;
            })
        )
    }

    const [customizeApplied, setCustomizeApplied] = useState(false)
    const onChangeProduct = (idArticulo: number) => {


        try {
            if (!isValidField(idArticulo)) return;

            showLoader();
            productSvc.getForSale(idArticulo).then(response => {
                hideLoader();
                const { product, medidas } = response;
                if (product.llevaInventario) {
                    notify({
                        type: ToastType.Warning,
                        content: 'Seleccione un articulo de tipo servicio!'
                    })
                    return
                }
                const dataMedida = medidas.find(m => m.idMedida === product.idMedida);
                const dataTarifaImpuesto = dataFormPos.dataPopulatedTax.taxRates[product.codigoPorcentaje];
                const dataTarifa = dataMedida?.pvps.find(t => t.default)
                console.log(dataTarifaImpuesto)
                const precioConIVA = orderData.order.total;
                const price = pricingCalculateUtil.calculatePriceSale(precioConIVA, dataTarifaImpuesto.porcentaje);
                const taxValue = precioConIVA - price;

                const newItem: OrderItem = {
                    uuid: generateUuidv4(),
                    itemTypeCode: ITEM_TYPE_CODE.ITEM,
                    id: 0,
                    itemId: 0,
                    menuId: 0,
                    taxId: dataFormPos.dataPopulatedTax.taxes[dataTarifaImpuesto.codImpuesto].idImpuesto,
                    taxPercentId: dataTarifaImpuesto.idTarifaImpuesto,
                    feeId: dataTarifa?.idTarifa || 0,
                    taxValue: roundNumber(taxValue, 5),
                    quantity: 1,
                    cost: product.precioCosto,
                    price,
                    discount: 0,
                    total: price,
                    obs: "",
                    bodegaId: orderData.order.items[0]?.bodegaId || 0,
                    medidaId: dataMedida?.idMedida || 0,
                    medida: '',

                    codigoTarifaImpuesto: dataTarifaImpuesto.codigo,
                    taxPercent: dataTarifaImpuesto.porcentaje,
                    //Campos adicionales 
                    productId: product.idArticulo,
                    code: product.codigoArticulo,
                    precioConIVA: precioConIVA,
                    precioTotalSinImpuesto: price,
                    descripcion: product.descripcion,
                    medidas,
                    pvps: [],
                    llevaInventario: false,
                    consolidacionesFecha: []
                }
                setCustomOrderItems([newItem]);
                setCustomizeApplied(true)
                setChangeField("description", product.descripcion)
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    function getDataCustomer(params?: unknown) {
        if (params !== null && typeof params === 'object') {
            const dataCustomer = params as { idCliente: number, razonSocialComprador: string }
            setData(
                produce((state) => {
                    state.customerCompanyId = dataCustomer.idCliente as number;
                    state.customerName = dataCustomer.razonSocialComprador as string
                })
            )
        }
    }


    async function saveAsInvoice() {
        try {
            if (!(data.customerCompanyId > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: 'Seleccione el cliente'
                })
                return
            }
            if (customOrderItems.length === 0 || orderData.order.items.length === 0) {
                notify({
                    type: ToastType.Warning,
                    content: 'El detalle no puede ser vacio'
                })
                return
            }
            if (customOrderItems.length > 1) {
                notify({
                    type: ToastType.Warning,
                    content: 'No has ingresado detalle personalizado'
                })
                return
            }
            if (!isValidField(data.description.trim())) {
                notify({
                    type: ToastType.Warning,
                    content: 'Ingrese la descripción'
                })
                return
            }

            const { isConfirmed } = await Swal.fire({
                title: `Guardar`,
                html: `Esta seguro de guardar como Factura? </br>
                <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'No, cancelar!'
            })

            if (!isConfirmed) return

            const cloneOrder = {
                ...orderData.order,
                customerCompanyId: data.customerCompanyId,
                obs: data.obs,
                items: customOrderItems.map(item => {
                    return {
                        ...item,
                        descripcion: data.description,
                    }
                })
            }



            const orderResult = orderAdapter.postTo(cloneOrder);
            // const orderItemsResult = itemToApi(changeOrderItems); 

            const params = {
                ...orderResult,
                subtotalSinImpuestos: 0,
                // tax: RoundNumber(tax, 5),
                // total: objTempTotal.total,

                updateOrder: false,
                saveDoc: true,
                codDoc: DOC_TYPE.FV,
                quickSale: true,

                items: [],
                customDetail: cloneOrder.items,
            }


            showLoader()
            orderSvc.put(cloneOrder.orderId, params).then(response => {
                hideLoader()
                if (response.code === '0') {
                    notify({
                        type: ToastType.Warning,
                        content: response.message
                    })
                }
                if (response.code === "1") {
                    notify({
                        type: ToastType.Success,
                        content: response.message
                    })
                    const returnDataSave: OrderToSaveReturnData = JSON.parse(response.payload as string)[0];
                    openModalPayment(returnDataSave);
                }
            })
                .catch(() => hideLoader())
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    function openModalPayment(params: OrderToSaveReturnData) {
        openDialog({
            maxWidth: 'xl',
            fullScreen: true,
            children: <Payment close={returnClosePaymentDialog} data={{
                idCuentaPorCobrar: params.idCuentaPorCobrar,
                codEstab: params.codEstab
            }} />
        })

        function returnClosePaymentDialog<T>(data: T) {
            if (data !== null && typeof data === 'object') {
                printerDoc(params)
            }
            //Cerramos ventana custom item 
            close();

            //cerramos dialog pago 
            closeDialog();

            //Refrescamos la ventana de división orden 
            setRefreshOrderList(DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST)
        }
    }

    function printerDoc(data: OrderToSaveReturnData) {
        if (data.printerAutomatic) {
            getPrinterFactura(data.orderId, data.idDocumento)
        }
    }

    return (
        <>
            <DialogHeader title='Detalle Personalizado' close={() => close()} />
            <DialogContent dividers>
                <Grid container spacing={1} marginBottom={2}>
                    <Grid item xs={12} sm={12} lg={6} xl={6}>
                        <CompanyCustomerSearch callbackfn={getDataCustomer} advanced id={data.customerCompanyId} customerName={data.customerName} />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6} xl={6}>
                        <ProductSearch onChange={onChangeProduct} />
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='center'>Nro.</StyledTableCell>
                                <StyledTableCell align="center">Código</StyledTableCell>
                                <StyledTableCell align="center">Descripción</StyledTableCell>
                                <StyledTableCell align="center">Cantidad</StyledTableCell>
                                <StyledTableCell align="center">P. IVA</StyledTableCell>
                                <StyledTableCell align="center">Total</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customOrderItems.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" align='center'>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center">{row.code}</TableCell>
                                    <TableCell align="center" width={400}>
                                        {
                                            customizeApplied ? (
                                                <TextField
                                                    multiline
                                                    size='small'
                                                    value={data.description || ''}
                                                    fullWidth
                                                    onChange={(e) => setChangeField("description", e.target.value)}
                                                />
                                            ) : (row.descripcion)
                                        }

                                    </TableCell>
                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="center">{ccyFormat(row.precioConIVA)}</TableCell>
                                    <TableCell align="center">{ccyFormat(row.quantity * row.precioConIVA)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4}  ></TableCell>
                                <TableCell align='center' sx={{ fontWeight: 700 }}>Total: </TableCell>
                                <TableCell align="center">{ccyFormat(orderData.order.total)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box marginBottom={1} marginTop={1}>
                    <TextField
                        id="obs"
                        label="Observación"
                        name='obs'
                        onChange={(e) => setChangeField("obs", e.target.value)}
                        fullWidth
                        multiline
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            size='large'
                            fullWidth
                            onClick={saveAsInvoice}
                        >
                            Facturar
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button color='inherit' variant='outlined' size='large' fullWidth onClick={() => close()}  >
                            Cerrar
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    )
}

export default CustomOrderItem