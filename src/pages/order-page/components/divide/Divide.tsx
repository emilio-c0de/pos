import ErrorBoundary from '@/components/common/ErrorBoundary'
import { CloseIcon } from '@/components/common/IconsMaterial'
import { configSvc } from '@/services/config.service'
import { orderSvc } from '@/services/order.service'
import { getDataEstab } from '@/services/persist-user.service'
import { useDivideStore } from '@/store/order/divide/divide.slice'
import { DIVIDE_STATUS_REFRESH } from '@/store/order/divide/divide.type'
import { useSharedStore } from '@/store/pos/shared.slice'
import { hideLoader, showLoader } from '@/utils/loader'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import DivideContent from './components/DivideContent'

type DivideProps = {
    orderId: number
    close<T>(data?: T): void
}
const Divide = ({ close, orderId }: DivideProps) => {
    const sharedStore = useSharedStore(useShallow(state => state))
    const divideStore = useDivideStore(useShallow(state => state))

    const getDataForm = () => {
        try {
            const codEstab = getDataEstab().codEstab;
            // Verificar si el codEstab existe
            if (codEstab) {
                sharedStore.setLoading(true);
                // Obtener datos del formulario
                configSvc.getDataForm({ codEstab }).then(response => {
                    if (response) {
                        sharedStore.setDataFormPos(response);
                    }

                }).catch(error => {
                    console.log(error);
                }).finally(() => sharedStore.setLoading(false));
            }
        } catch (error) {
            sharedStore.setLoading(false);
            console.log(error)
        }
    }

    const getDataOrderById = () => {
        try {
            showLoader();
            orderSvc.getId(orderId).then(response => {
                divideStore.initLoadOrderData(response)
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getDataForm();
        getDataOrderById();
        return () => {
            divideStore.resetState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (divideStore.REFRESH_CONTENT_DIVIDE === DIVIDE_STATUS_REFRESH.REFRESH_CONTENT_DIVIDE) {
            getDataOrderById();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [divideStore.REFRESH_CONTENT_DIVIDE])

    return (
        <>
            <ErrorBoundary fallBackComponent={<>Error</>}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => close(divideStore.REFRESH_CONTENT_DIVIDE)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Completar Venta
                        </Typography>
                        {/* <Button autoFocus color="inherit" onClick={close}>
                        save
                    </Button> */}
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 2 }}>
                    <DivideContent />
                </Box>
            </ErrorBoundary>
        </>
    )
}

export default Divide