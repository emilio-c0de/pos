import { CuentaPorCobrarProps } from '@/models/external/cuenta-por-cobrar.model'
import { usePaymentStore } from '@/store/payment/paymentStore.'
import { Stack } from '@mui/material'
import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import axios, { CancelTokenSource } from 'axios'
import { FC, useEffect } from 'react'

import ErrorBoundary from '../common/ErrorBoundary'
import { CloseIcon } from '../common/IconsMaterial'
import PaymentCalculator from './components/payment-calculator/PaymentCalculator'
import PaymentInfo from './components/payment-info/PaymentInfo'
import PaymentMethod from './components/payment-method/PaymentMethod'

type PaymentProps<T> = {
    data: T
    close<U>(data?: U): void
}
const Payment: FC<PaymentProps<CuentaPorCobrarProps>> = ({ close, data }) => {
    const { fetchDataForm, loading, error } = usePaymentStore(state => state)
    let cancelTokenSource!: CancelTokenSource;

    const getDataForm = () => {
        if (cancelTokenSource) {
            // Cancel the previous request before making a new request
            cancelTokenSource.cancel('Request canceled');
        }
        // Create a new CancelTokenSource
        const params = {
            idCuentaPorCobrar: data.idCuentaPorCobrar,
            codEstab: data.codEstab
        }
        cancelTokenSource = axios.CancelToken.source();
        fetchDataForm(params, close)
    }

    useEffect(() => {
        getDataForm();
        return () => {
            if (cancelTokenSource) cancelTokenSource.cancel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(loading)

    if (loading) {
        return (
            <Box>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
        )
    }
    if (error) {
        return (
            <>
                <Alert variant="filled" severity="error" action={
                    <IconButton color="inherit" size="small" onClick={close}>
                        <CloseIcon />
                    </IconButton>
                }>
                    Error al cargar datos del cobro!
                </Alert>
            </>
        )
    }


    return (
        <>
            <ErrorBoundary fallBackComponent={<>Error</>}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={close}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Cobro
                        </Typography>
                        {/* <Button autoFocus color="inherit" onClick={close}>
                        save
                    </Button> */}
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={5} lg={5} sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block', xl: 'block' } }}>
                            <PaymentCalculator />
                        </Grid>
                        <Grid item xs={12} sm={12} md={7} lg={7}>
                            <Stack spacing={2}>
                                <PaymentInfo />
                                <PaymentMethod />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </ErrorBoundary>
        </>
    )
}

export default Payment