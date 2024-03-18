import { usePosStore } from '@/store/pos/posStore';
import { calculateTaxesTotals } from '@/utils/calculate-taxes-totals';
import { roundNumber } from '@/utils/round-number.util';
import { Box, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useShallow } from 'zustand/react/shallow';

import TableButton from './TableButton';

const CartFooter = () => {
  const sharedStore = usePosStore.sharedStore(useShallow(state => state))
  const cartStore = usePosStore.cartStore(useShallow(state => state))
  const dataTaxTotals = calculateTaxesTotals(cartStore.order.items, sharedStore.dataFormPos.dataPopulatedTax.taxRates);
  const onChangeVendedor = (id: number) => {

    cartStore.setUpdateOrderData({
      userId: id
    })
  }
  const onChangeObservacion = (obs?: string) => {
    cartStore.setUpdateOrderData({
      obs: obs
    })
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={8} lg={8}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TableButton />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              {
                sharedStore.dataFormPos.vendedores.length > 0 && (
                  <TextField
                    id="vendedor"
                    select
                    label="Vendedor"
                    value={cartStore.order.userId || ""}
                    size='small'
                    fullWidth
                    onChange={(e) => onChangeVendedor(Number(e.target.value))}
                  >
                    {
                      sharedStore.dataFormPos.vendedores.map((item, index) => (
                        <MenuItem key={index} value={item.idUsuario} >
                          {item.nombreUsuario}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                )
              }

            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                id="observacion"
                label="Observación"
                fullWidth
                value={cartStore.order.obs || ""}
                size='small'
                multiline
                onChange={(e) => onChangeObservacion(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={4}>
          <Box textAlign="end">
            {
              dataTaxTotals.dataTotales.map((item, index) => (
                <Stack direction="row" justifyContent="end" key={index}>
                  <Typography variant="subtitle2" fontSize={item.fontSize} color={item.color} fontWeight={700}>
                    {item.name}:
                  </Typography>
                  <Typography width={50} variant="subtitle2" fontSize={item.fontSize} color={item.color} fontWeight={700}   >
                    ${roundNumber(item.value, 2)}
                  </Typography>
                </Stack>
              ))
            }
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default CartFooter