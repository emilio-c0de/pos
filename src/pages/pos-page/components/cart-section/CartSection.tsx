import { AddShoppingCartIcon } from '@/components/common/IconsMaterial'
import CompanyCustomerSearch from '@/components/company-customer/CompanyCustomerSearch'
import { OrderItem } from '@/models/order.model'
import { productSvc } from '@/services/external/product.service'
import { getCantidadStock } from '@/store/pos/cart/cart.utils'
import { usePosStore } from '@/store/pos/posStore'
import { hideLoader, showLoader } from '@/utils/loader'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Swal from 'sweetalert2'
import { useShallow } from 'zustand/react/shallow'

import Cart from './components/cart/Cart'
import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import CartFooter from './components/CartFooter'

const CartSection = () => {
    const cartStore = usePosStore.cartStore(useShallow(state => state));
    const cartDrawerStore = usePosStore.cartDrawerStore(useShallow(state => state));
    const items = cartStore.order.items;

    function getDataCustomer(params?: unknown) {
        if (params !== null && typeof params === 'object') {
            const dataCustomer = params as { idCliente: number, razonSocialComprador: string }
            cartStore.setUpdateOrderData({
                customerCompanyId: dataCustomer.idCliente as number,
                customerName: dataCustomer.razonSocialComprador as string
            })
        }
    }

    const decrementQuantity = (item: OrderItem) => {
        const tempItem = structuredClone(item);
        tempItem.quantity -= 1;
        cartStore.setChangeValueCart({
            property: 'quantity',
            orderItem: tempItem
        })
    }

    const incrementQuantity = (item: OrderItem) => {
        const tempItem = structuredClone(item);
        tempItem.quantity += 1;

        //Cuando el articulo es un servicio
        if (!tempItem.llevaInventario) {
            cartStore.setChangeValueCart({
                property: "quantity",
                orderItem: tempItem
            })
            return
        }

        checkStock(tempItem, item.quantity)

    }

    const checkStock = (tempItem: OrderItem, oldQuantity: number) => {
        // Obtiene la cantidad de stock disponible para el artículo.
        const cantidadStock = getCantidadStock(tempItem, cartStore.order.createdAt);
 
        if (cantidadStock === 0) {
            cartStore.setChangeValueCart({
                property: "quantity",
                orderItem: tempItem
            })
            return
        }

        showLoader();
        productSvc.checkStock({
            idArticulo: tempItem.productId,
            idBodega: tempItem.bodegaId,
            cantidad: cantidadStock,
        }).then(async response => {
            hideLoader();
            const { code, message, titleSms } = response;

            // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
            if (code === "1") {
                cartStore.setChangeValueCart({
                    property: "quantity",
                    orderItem: tempItem
                })
                return;
            }

            // Muestra un mensaje de advertencia y espera la confirmación del usuario.
            const { isConfirmed } = await Swal.fire({
                title: `<small>${titleSms}</small>`,
                icon: 'warning',
                html: `<small>${message}</small>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            // Según la confirmación, realiza acciones adicionales.
            if (isConfirmed) {

                // Si el código es "0", restaura el valor anterior y realiza cálculos totales.
                if (code === "0" && oldQuantity > 0) {
                    tempItem.quantity = oldQuantity;
                    cartStore.setChangeValueCart({
                        property: 'quantity',
                        orderItem: tempItem
                    })
                    return
                }
                if (code === "2") {
                    // Si el código es "2", solo realiza cálculos totales.
                    cartStore.setChangeValueCart({
                        property: "quantity",
                        orderItem: tempItem
                    })
                }
            }
        })
    }


    const changeinputQuantity = (item: OrderItem, newQuantity: number) => {
        const tempItem = structuredClone(item);
        if (newQuantity <= tempItem.quantity) {
            tempItem.quantity = newQuantity;
            cartStore.setChangeValueCart({
                property: 'quantity',
                orderItem: tempItem
            })
            return
        }
        if (newQuantity >= tempItem.quantity) {
            tempItem.quantity = newQuantity;
            checkStock(tempItem, item.quantity)
        }
    }

    const onClickOpenDrawer = (item: OrderItem) => {
        
        cartDrawerStore.setOpenCartDrawer({
            isOpenCartDrawer: true,
            orderItem: item
        })
    }

    const renderCart = () => {

        if (items.length === 0) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>

                    <AddShoppingCartIcon sx={{
                        height: "5rem!important",
                        width: '5rem',
                        color: 'rgba(59, 130, 246, 0.5)'
                    }} />
                    <Typography color="text.secondary" variant="caption">Vació</Typography>
                </div>
            )
        }
        return (items.map((item, index) => (
            <Cart
                key={index}
                item={item}
                deleteCartItem={() => cartStore.deleteCartItem(item)}
                decrementQuantity={() => decrementQuantity(item)}
                incrementQuantity={() => incrementQuantity(item)}
                changeInputQuantity={(newQuantity) => changeinputQuantity(item, newQuantity)}
                onClickOpenDrawer={() => onClickOpenDrawer(item)}
            />
        ))
        )
    }

    return (
        <>
            <Box
                height="100vh"
                width="100%"
                //   display="flex" 
                //   gap={4}
                p={2}

                sx={{
                    flexGrow: 1,
                    p: 1, // Espaciado interno
                    bgcolor: 'background.paper', // Utiliza el color de fondo de Paper
                    borderRadius: 5
                }}
            >
                <CompanyCustomerSearch
                    advanced
                    callbackfn={getDataCustomer}
                    id={cartStore.order.customerCompanyId}
                    customerName={cartStore.order.customerName}
                />

                <Box sx={{ width: '100%', pt: 1, height: 350, overflowY: 'auto', borderRadius: 5, bgcolor: 'background.paper' }}>
                    <Stack direction="column" spacing={2}>
                        {renderCart()}
                    </Stack>
                </Box>
                <Divider sx={{ m: 1 }} />
                <CartFooter />
                <Divider sx={{ m: 1 }} />
                <CartButton />
                <CartDrawer />
            </Box>

        </>
    )
}

export default CartSection