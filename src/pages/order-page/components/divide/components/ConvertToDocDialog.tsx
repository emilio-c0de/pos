import { orderAdapter } from '@/adapters/order.adapter'
import CompanyCustomerSearch from '@/components/company-customer/CompanyCustomerSearch'
import Payment from '@/components/payment/Payment'
import DialogHeader from '@/components/ui/DialogHeader'
import { DOC_TYPE } from '@/constants/constants'
import { useDialog } from '@/context/DialogProvider'
import { OrderToSaveReturnData } from '@/models/order.model'
import { orderSvc } from '@/services/order.service'
import { useDivideStore } from '@/store/order/divide/divide.slice'
import { DIVIDE_STATUS_REFRESH, OrderItemDivide } from '@/store/order/divide/divide.type'
import { hideLoader, showLoader } from '@/utils/loader'
import { pricingCalculateUtil } from '@/utils/pricing-calculate.util'
import { notify, ToastType } from '@/utils/toastify/toastify.util'
import { ccyFormat, getPrinterFactura, getPrinterNotaEntrega } from '@/utils/utils'
import { Box, Button, DialogActions, Stack, TextField, Typography } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import { produce } from 'immer'
import { useRef, useState } from 'react'
import Swal from 'sweetalert2'

const typeActions: { [key: string]: string } = {
  [DOC_TYPE.FV]: `
        Esta seguro de guardar como Factura? `,
  [DOC_TYPE.NE]: `
        Esta seguro de guardar como Nota de Entrega? `,
}

const getDataTotalDetalle = (orderItem: OrderItemDivide) => {
  const precioTotalSinImpuesto = ((orderItem.price * (orderItem.remainingQuantity || 0))) - orderItem.discount;
  const valorImpuesto = pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, orderItem.taxPercent);
  const total = precioTotalSinImpuesto + valorImpuesto;
  return {
    precioTotalSinImpuesto,
    valorImpuesto,
    total
  }
}

type ConvertToDocDialogProps = {
  close(): void
}


const ConvertToDocDialog = ({ close }: ConvertToDocDialogProps) => {

  const [openDialog, closeDialog] = useDialog();

  const { orderData, orderDivideItems, setRefreshOrderList, selected } = useDivideStore(state => state);

  const [data, setData] = useState({
    customerCompanyId: orderData.order.customerCompanyId,
    customerName: orderData.order.customerName,
    obs: ''
  });
  const codDoc = useRef<DOC_TYPE.FV | DOC_TYPE.NE>(DOC_TYPE.FV)

  let filteredOrderItems = structuredClone(orderDivideItems);

  filteredOrderItems = filteredOrderItems.filter(({ id }) => selected.indexOf(id) !== -1).map(item => {
    const dataTotal = getDataTotalDetalle(item);
    item.taxValue = dataTotal.valorImpuesto;
    item.total = dataTotal.total;
    return item;
  })

  const { orderDivideImporteTotal, orderDivideQuantityTotal, subTotalSinImpuestos } = filteredOrderItems.reduce((acc, prev) => {
    acc.orderDivideImporteTotal += prev.total;
    acc.orderDivideQuantityTotal += (prev.remainingQuantity || 0);
    acc.subTotalSinImpuestos += (((prev.remainingQuantity || 0) * prev.price) - prev.discount);
    return acc;
  }, {
    orderDivideImporteTotal: 0,
    orderDivideQuantityTotal: 0,
    subTotalSinImpuestos: 0,
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


  const handleClickSave = (doc: DOC_TYPE.FV | DOC_TYPE.NE) => {
    codDoc.current = doc;
    save();
  }

  const save = async () => {
    try {


      if (!(data.customerCompanyId > 0)) {
        notify({
          type: ToastType.Warning,
          content: 'Seleccione el cliente'
        })
        return
      }

      if (filteredOrderItems.length === 0) {
        notify({
          type: ToastType.Warning,
          content: 'El detalle es vacio '
        })
        return
      }

      const { isConfirmed } = await Swal.fire({
        title: `Convertir a un documento`,
        html: typeActions[codDoc.current],
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
        subTotalSinImpuestos,
        customerCompanyId: data.customerCompanyId,
        obs: data.obs,
        total: orderDivideImporteTotal,
        items: filteredOrderItems.map(item => {
          return {
            ...item,
            quantity: (item.remainingQuantity || 0)
          }
        })
      }

      const orderResult = orderAdapter.postTo(cloneOrder);

      const params = {
        ...orderResult,
        updateOrder: false,
        saveDoc: true,
        codDoc: codDoc.current,
        quickSale: true,
        items: orderResult.items,
        itemsToPay: orderResult.items,
      }



      showLoader();
      orderSvc.put(cloneOrder.orderId, params).then(response => {
        hideLoader();
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
      console.log(error)
    }
  }

  function openModalPayment(params: OrderToSaveReturnData) {
    openDialog({
      maxWidth: 'xl',
      fullScreen: true,
      children: <Payment close={(e) => returnClosePaymentDialog(e, params)} data={{
        idCuentaPorCobrar: params.idCuentaPorCobrar,
        codEstab: params.codEstab
      }} />
    })

  }

  function returnClosePaymentDialog<T>(data?: T, params?: OrderToSaveReturnData) {
    if (data !== null && typeof data === 'object' && params) {
      printerDoc(params)
    }
    //Cerramos dialog Convert to Doc 
    close();

    //cerramos dialog pago 
    closeDialog();

    //Refrescamos la ventana de división orden 
    setRefreshOrderList(DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST)
  }

  function printerDoc(data: OrderToSaveReturnData) {
    if (data.printerAutomatic) {
      if (codDoc.current === DOC_TYPE.FV) {
        getPrinterFactura(data.orderId, data.idDocumento)
      }
      if (codDoc.current === DOC_TYPE.NE) {
        getPrinterNotaEntrega(data.orderId, data.idDocumento)
      }
    }
  }

  return (
    <>
      <DialogHeader title='Convertir a Documento' close={() => close()} />
      <DialogContent dividers>
        <Grid container spacing={1} marginBottom={2}>
          <Grid item xs={12}>
            <CompanyCustomerSearch callbackfn={getDataCustomer} advanced id={data.customerCompanyId} customerName={data.customerName} />

          </Grid>
        </Grid>
        <Stack direction="column" justifyContent="center" spacing={1}>
          <Box textAlign="center">
            <Typography variant='h6'>Cantidad:</Typography>
            <Typography variant='h4'>{orderDivideQuantityTotal}</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant='h6'>Total:</Typography>
            <Typography variant='h4' color="primary">
              {ccyFormat(orderDivideImporteTotal)}
            </Typography>
          </Box>
        </Stack>

        <Box marginBottom={1} marginTop={1}>
          <TextField
            id="obs"
            label="Observación"
            name='obs'
            value={data.obs}
            fullWidth
            multiline
            onChange={(e) => setChangeField("obs", e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Button
              variant='contained'
              size='large'
              fullWidth
              color='success'
              onClick={() => handleClickSave(DOC_TYPE.FV)}
            >
              Factura
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Button
              variant='contained'
              size='large'
              fullWidth
              color="warning"
              onClick={() => handleClickSave(DOC_TYPE.NE)}
            >
              Nota Entrega
            </Button>
          </Grid>
          <Grid item xs={12}  >
            <Button color='inherit' variant='outlined' size='large' fullWidth onClick={() => close()}  >
              Cerrar
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </>

  )
}

export default ConvertToDocDialog