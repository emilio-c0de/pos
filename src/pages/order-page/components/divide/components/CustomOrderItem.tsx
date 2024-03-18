import CompanyCustomerSearch from '@/components/company-customer/CompanyCustomerSearch'
import ProductSearch from '@/components/product/ProductSearch'
import DialogHeader from '@/components/ui/DialogHeader'
import { StyledTableCell } from '@/components/ui/StyledTableCell'
import { ITEM_TYPE_CODE } from '@/constants/constants'
import { OrderItem } from '@/models/order.model'
import { productSvc } from '@/services/external/product.service'
import { useDivideStore } from '@/store/order/divide/divide.slice'
import { useSharedStore } from '@/store/pos/shared.slice'
import { generateUuidv4 } from '@/utils/generate-uuidv4'
import { pricingCalculateUtil } from '@/utils/pricing-calculate.util'
import { roundNumber } from '@/utils/round-number.util'
import { ToastType, notify } from '@/utils/toastify/toastify.util'
import { ccyFormat, isValidField } from '@/utils/utils'
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
import { useState } from 'react'



type CustomOrderItemProps = {
    close(): void,
    selected: number[]
}
interface OrderItemCustom extends Partial<OrderItem> { envioSri?: boolean, paid?: boolean, precioConIVA: number, quantity: number }
const CustomOrderItem = ({ close }: CustomOrderItemProps) => {

    const { orderData } = useDivideStore(state => state);
    const { dataFormPos } = useSharedStore(state => state);

    const [orderItems, setOrderItems] = useState<OrderItemCustom[]>(orderData.order.items);
    const [customizeApplied, setCustomizeApplied] = useState(true)
    const onChangeProduct = (idArticulo: number) => {


        try {
            if (!isValidField(idArticulo)) return;
            productSvc.getForSale(idArticulo).then(response => {
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

                const precioConIVA = orderData.order.total;
                const price = pricingCalculateUtil.calculatePriceSale(precioConIVA, dataTarifaImpuesto.porcentaje);
                const taxValue = precioConIVA - price;

                console.log(product)
                const newItem: OrderItemCustom = {
                    uuid: generateUuidv4(),
                    itemTypeCode: ITEM_TYPE_CODE.ITEM,
                    id: 0,
                    itemId: 0,
                    menuId: 0,
                    taxId: dataTarifaImpuesto.idImpuesto,
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
                    envioSri: true,
                    paid: false
                }
                setOrderItems([newItem])
            })
        } catch (error) {
            console.log(error)
        }
        console.log(idArticulo)
    }
    return (
        <>
            <DialogHeader title='Detalle Personalizado' close={() => close()} />
            <DialogContent dividers>
                <Grid container spacing={1} marginBottom={2}>
                    <Grid item xs={6}>
                        <CompanyCustomerSearch advanced />
                    </Grid>
                    <Grid item xs={6} >
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
                            {orderItems.map((row, index) => (
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
                                                <TextField multiline size='small' fullWidth />
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