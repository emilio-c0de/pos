import ErrorBoundary from '@/components/common/ErrorBoundary';
import { configSvc } from '@/services/config.service';
import { getDataEstab } from '@/services/persist-user.service';
import { usePosStore } from '@/store/pos/posStore';
import { notify, ToastType } from '@/utils/toastify/toastify.util';
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow';

import CartSection from './components/cart-section/CartSection';
import ItemSection from './components/item-section/ItemSection';

const PosPage = () => {
    const sharedStore = usePosStore.sharedStore(state => state);
    const cartStore = usePosStore.cartStore(useShallow(state => state))

    const getDataForm = () => {
        const codEstab = getDataEstab().codEstab;
        // Verificar si el codEstab existe
        if (codEstab) {
            sharedStore.setLoading(true);
            // Obtener datos del formulario
            configSvc.getDataForm({ codEstab }).then(response => {

                sharedStore.setLoading(false);

                if (response) {
                    let establecimientoId = 0, userId = 0, tableName = '', tableId = 0, bodegaId = 0, puntoEmisionId = 0;

                    const dataEstab = response.establecimientos.find(estab => estab.codEstab === codEstab);
                    console.log(response.establecimientos)
                    if (dataEstab) {
                        establecimientoId = dataEstab.idEstablecimiento;
                        bodegaId = dataEstab.bodegas.find(b => b.defaultBodega)?.idBodega || 0;
                        puntoEmisionId = dataEstab.puntosEmision.find(p => p.defaultPtoEmi)?.idPuntoEmision || 0;
                    }

                    const tables = Object.values(response.dataPopulatedFloorRoomTable.tables);

                    sharedStore.setDataFormPos(response);

                    if (!(cartStore.order.orderId > 0) && response.vendedores.length > 0) {
                        userId = response.vendedores[0].idUsuario;
                    }

                    // Verificar si no hay un orderId en el carrito y hay mesas disponibles
                    if (!(cartStore.order.orderId !== 0) && tables.length > 0) {
                        // Obtener la primera mesa disponible y su habitación asociada
                        const dataTable = tables[0];
                        const dataRoom = response.dataPopulatedFloorRoomTable.rooms[dataTable.roomId];
                        if (dataRoom) {
                            // Construir el nombre de la mesa
                            tableName = `${dataRoom.description} - ${dataTable.description}`;
                            tableId = dataTable.id;

                        }
                    }
                    // Actualizar los datos de la orden en el carrito
                    const data = {
                        tableName: cartStore.order.orderId > 0 ? cartStore.order.tableName : tableName,
                        tableId: cartStore.order.orderId > 0 ? cartStore.order.orderId : tableId,
                        establecimientoId: establecimientoId,
                        puntoEmisionId: cartStore.order.orderId > 0 ? cartStore.order.puntoEmisionId : puntoEmisionId,
                        bodegaId: bodegaId,
                        userId: cartStore.order.orderId > 0 ? cartStore.order.userId : userId,
                    };
                    cartStore.setUpdateOrderData(data);
                }
            }).catch(error => {
                console.log(error);
            }).finally(() => sharedStore.setLoading(false));
        } else {
            notify({
                type: ToastType.Error,
                content: 'No se encontro el Establecimiento'
            })
        }
    }
    useEffect(() => {
        getDataForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <ErrorBoundary fallBackComponent={<>Error!</>}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                        <ItemSection />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                        <CartSection />
                    </Grid>
                </Grid>
            </ErrorBoundary>
        </>
    )
}

export default PosPage