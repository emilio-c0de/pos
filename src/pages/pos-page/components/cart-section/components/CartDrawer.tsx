import { CloseIcon } from '@/components/common/IconsMaterial';
import { TAX_CODE } from '@/constants/constants';
import { usePosStore } from '@/store/pos/posStore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const drawerWidth = 350;

type Anchor = 'top' | 'left' | 'bottom' | 'right';
const CartDrawer = () => {
  const { isOpenCartDrawer, setOpenCartDrawer, orderItem, updateOrderItem } = usePosStore.cartDrawerStore(useShallow(state => state))
  const { setUpdateOrderItemCartDrawer } = usePosStore.cartStore(useShallow(state => state));
  const { dataFormPos } = usePosStore.sharedStore(useShallow(state => state));

  const { medidas, pvps } = orderItem;
  const taxRates = Object.values(dataFormPos.dataPopulatedTax.taxRates).filter(t => t.codImpuesto === TAX_CODE.IVA)

  const tempOrderItem = structuredClone(orderItem)
  useEffect(() => {
    return () => {

    }
  }, [])

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : drawerWidth, p: 1 }}
      role="presentation"
    // onClick={toggleDrawer(anchor, false)}
    // onKeyDown={toggleDrawer(anchor, false)}
    >
      <Card variant="outlined">
        <Box sx={{ my: 1, mx: 1 }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <IconButton aria-label="delete" onClick={() => setOpenCartDrawer({
                isOpenCartDrawer: false
              })}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h6" component="div">

              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider variant="middle" />
        <CardContent>

          <Stack
            component="form"
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <Typography variant="h6" gutterBottom fontWeight={700}>
              {orderItem.descripcion}
            </Typography>
            {
              taxRates.length > 0 && (
                <TextField
                  id="tipoIva"
                  select
                  label="Tipo Iva"
                  value={orderItem.codigoTarifaImpuesto}
                  fullWidth
                  size='small'
                  onChange={(e) => {
                    const codigoTarifaImpuesto = e.target.value;
                    const dataTarifaImpuesto = dataFormPos.dataPopulatedTax.taxRates[codigoTarifaImpuesto];

                    if (dataTarifaImpuesto) {
                      tempOrderItem.taxId = dataFormPos.dataPopulatedTax.taxes[dataTarifaImpuesto.codImpuesto].idImpuesto
                      tempOrderItem.taxPercentId = dataTarifaImpuesto.idTarifaImpuesto;
                      tempOrderItem.taxPercent = dataTarifaImpuesto.porcentaje;
                      tempOrderItem.codigoTarifaImpuesto = dataTarifaImpuesto.codigo;

                      setUpdateOrderItemCartDrawer(tempOrderItem);
                      updateOrderItem(tempOrderItem)
                    }
                  }}
                >
                  {
                    taxRates.map((tarifaImpuesto, index: number) => (
                      <MenuItem key={index} value={tarifaImpuesto.codigo}>
                        {tarifaImpuesto.descripcion}
                      </MenuItem>
                    ))
                  }
                </TextField>
              )
            }



            {
              medidas && medidas.length > 0 && (
                <TextField
                  id="medida"
                  select
                  label="Medida"
                  value={orderItem.medidaId}
                  fullWidth
                  size='small'
                  onChange={(e) => {
                    const medidaId = Number(e.target.value);
                    const dataMedida = orderItem.medidas.find(m => (m.idMedida === medidaId));
                    if (dataMedida) {
                      const dataPVP = dataMedida.pvps.find(pvp => (pvp.default));
                      tempOrderItem.feeId = dataPVP?.idTarifa || 0
                      tempOrderItem.pvps = dataMedida.pvps;
                      tempOrderItem.medidaId = medidaId;
                      tempOrderItem.medida = dataMedida.descripcion;
                      tempOrderItem.price = dataPVP?.precioVenta || 0;
                      tempOrderItem.precioConIVA = dataPVP?.precioConIva || 0;

                      setUpdateOrderItemCartDrawer(tempOrderItem)
                      updateOrderItem(tempOrderItem)

                    }
                  }}
                >
                  {
                    medidas.map((medida, index: number) => (
                      <MenuItem key={index} value={medida.idMedida}>
                        {medida.descripcion}
                      </MenuItem>
                    ))
                  }
                </TextField>
              )
            }

            {
              pvps && pvps.length > 0 && (
                <TextField fullWidth
                  id="pvps"
                  name="pvps"
                  value={orderItem.feeId}
                  label="Tarifa"
                  select
                  size='small'
                  onChange={(e) => {
                    const idTarifa = Number(e.target.value);
                    const dataPVP = pvps.find(pvp => pvp.idTarifa === idTarifa);
                    if (dataPVP) {
                      tempOrderItem.feeId = idTarifa;
                      tempOrderItem.price = dataPVP.precioVenta;
                      tempOrderItem.precioConIVA = dataPVP.precioConIva;
                      setUpdateOrderItemCartDrawer(tempOrderItem)
                      updateOrderItem(tempOrderItem)


                    }
                  }}
                >
                  {
                    pvps.map((pvp, index) => (
                      <MenuItem value={pvp.idTarifa} key={index}>
                        {pvp.descripcion} - ${pvp.precioConIva}
                      </MenuItem>
                    ))
                  }
                </TextField>
              )
            }

            <TextField
              label="Comentario"
              id="obs"
              name="obs"
              value={orderItem.obs}
              multiline
              fullWidth
              onChange={(e) => {
                const obs = e.target.value;
                tempOrderItem.obs = obs;
                setUpdateOrderItemCartDrawer(tempOrderItem)
                updateOrderItem(tempOrderItem)

              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Drawer
      sx={{
        zIndex: 1300
      }}
      anchor="right"
      open={isOpenCartDrawer}
      onClose={() => setOpenCartDrawer({ isOpenCartDrawer: false })}
    >
      {list('right')}
    </Drawer>
  )
}

export default CartDrawer