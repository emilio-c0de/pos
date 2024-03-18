import { SaveIcon } from '@/components/common/IconsMaterial';
import { PaymentTypeCode } from '@/constants/constants';
import { usePaymentStore } from '@/store/payment/paymentStore.';
import { roundNumber } from '@/utils/round-number.util';
import { Box, Button, Card, CardContent, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material'

import Bank from './components/Bank';
import City from './components/City';
import DatosCobro from './components/DatosCobro';
import InputReceivedAmount from './components/InputReceivedAmount';
import PaymentSubType from './components/PaymentSubType';

const PaymentMethod = () => {

    const {
        save,
        dataForm,
        paymentSubTotal,
        paymentData,
        setChangeFieldFormPayment,
        setChangePaymentType,
        addPaymentType
    } = usePaymentStore(state => state);
    const paymentTypes = dataForm.paymentTypes.filter(p => p.code !== PaymentTypeCode.DOC);



    return (
        <Box sx={{ flexGrow: 1 }}>
            <Card variant="outlined">
                <CardContent>
                    <Grid item xs={12} sm container justifyContent="center">
                        <Grid item xs container direction="row" spacing={1}>
                            <Grid item xs>
                                <Typography variant="h6" gutterBottom>
                                    Total
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    ${roundNumber(paymentSubTotal.importeTotal, 2)}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h6" gutterBottom>
                                    Saldo
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    ${roundNumber(paymentSubTotal.totalSaldo, 2)}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Abono
                                </Typography>
                                <Typography variant="h5" gutterBottom color="primary">
                                    ${roundNumber(paymentSubTotal.totalAbonoAnterior, 2)}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h6" gutterBottom color="error">
                                    Cambio
                                </Typography>
                                <Typography variant="h5" gutterBottom color="error">
                                    ${roundNumber(paymentSubTotal.cambio, 2)}
                                </Typography>
                            </Grid>

                        </Grid>
                        {/* <Grid item>
                            <Typography variant="h5" component="div">
                                ${voucher.payingAmount}
                            </Typography>
                        </Grid> */}
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={6}>

                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Button
                                variant='contained'
                                style={{ backgroundColor: '#28a745', color: '#fff' }} // Bootstrap success color
                                startIcon={<SaveIcon fontSize='large' style={{ fontSize: 30 }} />}
                                size='large'
                                fullWidth
                                sx={{
                                    height: 60,
                                }}
                                onClick={save}
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                    <Box component="form"
                        my={2}
                        sx={{
                            padding: '16px',
                            border: '1px solid #17a2b8',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

                        }}
                        autoComplete="off">
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={12}>
                                {
                                    paymentTypes.length > 0 && <TextField fullWidth
                                        id="paymentType"
                                        name="paymentType"
                                        label="Entidad Financiera"
                                        select

                                        value={paymentData.paymentTypeId}
                                        onChange={(e) => {
                                            const paymentTypeData = paymentTypes.find(item => item.paymentTypeId === Number(e.target.value));
                                            if (paymentTypeData) {
                                                const paymentSubTypeData = paymentTypeData.paymentSubTypes[0]

                                                setChangePaymentType({
                                                    paymentSubTypeId: paymentSubTypeData?.paymentSubTypeId ?? 0,
                                                    paymentTypeId: paymentTypeData.paymentTypeId ?? 0,
                                                    paymentTypeCode: paymentTypeData.code,
                                                    paymentTypeDescription: paymentTypeData.description,
                                                    nro: "",
                                                    referencia: "",
                                                    aprobacion: "",
                                                    lote: "",
                                                    cityId: 0,
                                                    idBanco: 0
                                                })
                                            }
                                        }}
                                    >
                                        {
                                            paymentTypes.map((item, index) => (
                                                <MenuItem value={item.paymentTypeId} key={index}>
                                                    {item.description}
                                                </MenuItem>
                                            ))
                                        }


                                    </TextField>
                                }
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4}>
                                <PaymentSubType />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={8}>
                                <InputReceivedAmount />
                            </Grid>
                            {/* Other text field */}
                            {
                                paymentData.paymentTypeCode === PaymentTypeCode.TAR && (
                                    <>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Número"
                                                id="numero"
                                                name="numero"
                                                value={paymentData.nro}
                                                onChange={(e) => {
                                                    setChangeFieldFormPayment("nro", e.target.value)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Referencia"
                                                id="referencia"
                                                name="referencia"
                                                value={paymentData.referencia}
                                                onChange={(e) => {
                                                    setChangeFieldFormPayment("referencia", e.target.value)
                                                }}
                                            />
                                        </Grid>


                                        {/* second grid */}
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <City />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Aprobación"
                                                id="aprobacion"
                                                name="aprobacion"
                                                value={paymentData.aprobacion}
                                                onChange={(e) => {
                                                    setChangeFieldFormPayment("aprobacion", e.target.value)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Lote"
                                                id="lote"
                                                name="lote"
                                                value={paymentData.lote}
                                                onChange={(e) => {
                                                    setChangeFieldFormPayment("lote", e.target.value)
                                                }}
                                            />
                                        </Grid>

                                    </>
                                )
                            }

                            {
                                paymentData.paymentTypeCode === PaymentTypeCode.TRA && (
                                    <>

                                        <Grid item xs={12} sm={6}>
                                            <Bank />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Número"
                                                id="numero"
                                                name="numero"
                                                value={paymentData.nro}
                                                onChange={(e) => {
                                                    setChangeFieldFormPayment("nro", e.target.value)
                                                }}
                                            />
                                        </Grid>

                                    </>
                                )
                            }

                            {
                                paymentData.paymentTypeCode === PaymentTypeCode.CHE && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Bank />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <City />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Número"
                                                id="numero"
                                                name="numero"
                                                value={paymentData.nro}
                                                onChange={(e) => {
                                                    setChangeFieldFormPayment("nro", e.target.value)
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Referencia"
                                                id="referencia"
                                                name="referencia"
                                                value={paymentData.referencia}
                                                onChange={(e) => {
                                                    setChangeFieldFormPayment("referencia", e.target.value)
                                                }}
                                            />
                                        </Grid>

                                        {/* <Grid item xs={12} sm={6}>
                                            <FormControlLabel label="Posfechado" control={
                                                <Switch aria-label='Posfechado' value={paymentData.posfechado} defaultChecked={false} />
                                            } />
                                        </Grid> */}
                                    </>
                                )
                            }
                            <Grid item xs={12} md={12}>
                                <Button
                                    variant='contained'
                                    size='large'
                                    fullWidth
                                    sx={{
                                        height: 60,
                                    }}
                                    onClick={addPaymentType}
                                >
                                    Agregar cobro
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box
                        sx={{
                            padding: '16px',
                            border: '1px solid #17a2b8',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }} >
                        <DatosCobro />
                    </Box>

                </CardContent>
                {/* <CardActions>
                    <Grid container spacing={2} columns={16}>
                        <Grid item xs={16} md={8} lg={8}>

                        </Grid>
                        <Grid item xs={16} md={8} lg={8}>
                            <Button variant='contained' color="success" startIcon={<SaveIcon fontSize="large" style={{
                                fontSize: 40
                            }} />} size='large' fullWidth sx={{
                                height: 80
                            }} onClick={() => save()}>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions> */}
            </Card>
        </Box>
    )
}

export default PaymentMethod