import { orderAdapter } from '@/adapters/order.adapter'
import { CleaningServicesIcon, FileCopyRoundedIcon, SaveIcon } from '@/components/common/IconsMaterial'
import Payment from '@/components/payment/Payment'
import { DangerButton, PrimaryButton, SuccessButton, WarningButton } from '@/components/ui/CustomizeButton'
import { DOC_TYPE } from '@/constants/constants'
import { useDialog } from '@/context/DialogProvider' 
import { OrderToSaveReturnData } from '@/models/order.model'
import { orderSvc } from '@/services/order.service'
import { usePosStore } from '@/store/pos/posStore'
import { calculateTaxesTotals } from '@/utils/calculate-taxes-totals'
import { hideLoader, showLoader } from '@/utils/loader'
import { notify, ToastType } from '@/utils/toastify/toastify.util'
import { getPrinterFactura, getPrinterNotaEntrega, getPrinterOrder } from '@/utils/utils'
import { Grid } from '@mui/material'
import Swal from 'sweetalert2'
import { useShallow } from 'zustand/react/shallow'

const typeActions: { [key: string]: string } = {
    [DOC_TYPE.FV]: `
    ¿Estas seguro de guardar el pedido como Factura? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
    [DOC_TYPE.NE]: `
    ¿Estas seguro de guardar el pedido como Nota de Entrega? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
    [DOC_TYPE.OR]: `Esta seguro de guardar el pedido? </br>
    <small>El stock de los productos <strong>no se descontará</strong> hasta que se transforme a "Factura" o "Nota de Entrega".`
}

const CartButton = () => {
    const [openDialog, closeDialog] = useDialog();

    const { order, resetForm } = usePosStore.cartStore(useShallow(state => state))
    const { dataFormPos } = usePosStore.sharedStore(useShallow(state => state))
    const { items } = order;

    const isRegister = () => !(order.orderId > 0);
    const isUpdate = () => order.orderId > 0;



    async function saveUpdateOrder(codDoc: string) {
        const dataTaxTotals = calculateTaxesTotals(order.items, dataFormPos.dataPopulatedTax.taxRates);

        try {
            if (!(order.tableId > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: `Seleccione la Mesa`
                })
                return
            }

            if (!(order.establecimientoId > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: `El Establecimiento no proporcionado!`
                })
                return
            }
            if (!(order.puntoEmisionId > 0)) {
                notify({
                    type: ToastType.Warning,
                    content: `El Punto de Emisión no proporcionado!`
                })
                return
            }

            if (items.length === 0) {
                notify({
                    type: ToastType.Warning,
                    content: `Agregue al menos un Item`
                })
                return
            }

            if ((dataTaxTotals.importeTotal <= 0)) {
                notify({
                    type: ToastType.Warning,
                    content: `El importe total no puede ser 0`
                })
                return
            }

            const { isConfirmed } = await Swal.fire({
                title: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'} Pedido`,
                html: typeActions[codDoc],
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'}`,
                cancelButtonText: 'No, cancelar!'
            })

            if (!isConfirmed) return

            const data = {
                ...order,
                total: dataTaxTotals.importeTotal
            }
            const orderDataMapped = orderAdapter.postTo(data);
            const params = {
                ...orderDataMapped,
                updateOrder: (order.orderId > 0) && codDoc === DOC_TYPE.OR,
                saveDoc: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
                codDoc,
                quickSale: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
            }

            if (isRegister()) {
                showLoader();
                orderSvc.post(params).then(response => {
                    console.log(response)
                    hideLoader()
                    if (response.code === '0') {
                        Swal.fire({
                            icon: 'warning',
                            html: response.message
                        })

                    }
                    if (response.code === "1") {
                        Swal.fire({
                            icon: 'success',
                            html: response.message,
                            timer: 1000
                        })

                        //Se ha guardado como orden 
                        if (codDoc === DOC_TYPE.OR) {
                            const orderId = JSON.parse(response.payload as string);
                            getPrinterOrder(orderId)
                            resetForm();
                            return
                        }

                        //Se ha guardado el orden + el documento (Nota Entrega, Factura)
                        const queryParams: OrderToSaveReturnData = JSON.parse(response.payload as string)[0]

                        if (queryParams.payAutomatic) {
                            openModalPayment(queryParams, codDoc);
                            // payment.openDialogCustom(queryParams);
                            return
                        }


                        if (queryParams.printerAutomatic) {
                            printerDoc(queryParams, codDoc)
                        } else {
                            resetForm();
                        }
                    }
                }).catch(() => hideLoader())
            }

            if (isUpdate()) {
                showLoader();
                orderSvc.put(order.orderId, params).then(response => {
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
                        resetForm();
                    }
                }).finally(() => hideLoader())
            }


        } catch (error) {
            console.log(error)
        }
    }

    function printerDoc(data: OrderToSaveReturnData, codDoc: string) {
        if (data.printerAutomatic) {
            if (codDoc === DOC_TYPE.FV) {
                getPrinterFactura(data.orderId, data.idDocumento)
            }
            if (codDoc === DOC_TYPE.NE) {
                getPrinterNotaEntrega(data.orderId, data.idDocumento)
            }
        }  
        resetForm();
    }

    function openModalPayment(params: OrderToSaveReturnData, codDoc: string) {
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
                printerDoc(params, codDoc)
            }
            closeDialog();
        }
    }

    return (
        <Grid container spacing={1} justifyContent="stretch" alignItems="flex-end"  >
            <Grid item xs={6} sm={3} md={3} lg={3}>
                <DangerButton
                    className='buttonCart'
                    fullWidth

                    startIcon={<CleaningServicesIcon fontSize="small" />}>

                    Limpiar
                </DangerButton>
            </Grid>
            <Grid item xs={6} sm={3} md={3} lg={3}>
                <SuccessButton
                    className='buttonCart'
                    fullWidth
                    startIcon={<SaveIcon fontSize="small" />}
                    onClick={() => saveUpdateOrder(DOC_TYPE.OR)}
                >
                    Guardar
                </SuccessButton>
            </Grid>
            <Grid item xs={6} sm={3} md={3} lg={3}>
                <PrimaryButton
                    className='buttonCart'
                    fullWidth
                    startIcon={<FileCopyRoundedIcon fontSize="small" />}
                    onClick={() => saveUpdateOrder(DOC_TYPE.FV)}
                >
                    Factura
                </PrimaryButton>
            </Grid>
            <Grid item xs={6} sm={3} md={3} lg={3}>
                <WarningButton
                    className='buttonCart'
                    fullWidth
                    startIcon={<FileCopyRoundedIcon fontSize="small" />}
                    onClick={() => saveUpdateOrder(DOC_TYPE.NE)}
                >

                    Nota Entrega
                </WarningButton>
            </Grid>
        </Grid>
    )
}

export default CartButton