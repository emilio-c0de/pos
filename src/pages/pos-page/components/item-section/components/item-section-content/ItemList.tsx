import { Item } from '@/models/item.model';
import { OrderItem } from '@/models/order.model';
import { productSvc } from '@/services/external/product.service';
import { getCantidadStock } from '@/store/pos/cart/cart.utils';
import { usePosStore } from '@/store/pos/posStore';
import { generateUuidv4 } from '@/utils/generate-uuidv4';
import { hideLoader, showLoader } from '@/utils/loader';
import { pricingCalculateUtil } from '@/utils/pricing-calculate.util';
import { roundNumber } from '@/utils/round-number.util';
import { notify, ToastType } from '@/utils/toastify/toastify.util';
import { Grid } from '@mui/material';
import Swal from 'sweetalert2';
import { useShallow } from 'zustand/react/shallow';

import ItemCard from './ItemCard';

const ItemList = () => {
    const sharedStore = usePosStore.sharedStore(useShallow(state => state));
    const itemStore = usePosStore.itemStore(useShallow(state => state));
    const cartStore = usePosStore.cartStore(useShallow(state => state));
    const { items } = itemStore;
    const { dataPopulatedTax, establecimientos } = sharedStore.dataFormPos;


    const getBodegaId = () => {
        const dataEstab = establecimientos.find(estab => (estab.defaultEstab));
        if (dataEstab && dataEstab.bodegas) {
            const dataBodega = dataEstab.bodegas.find(bodega => (bodega.defaultBodega));
            if (dataBodega) return dataBodega.idBodega
        }
        return 0;
    }

    const handleAddToCart = async (item: Item) => {
      
        try {
            showLoader();
            // Busca información relacionada con la venta del artículo a través del servicio.
            productSvc.getForSale(item.productId).then(response => {
                hideLoader();


                const { product, medidas, consolidacionesFecha } = response;

                // Encuentra la medida predeterminada del producto.
                const dataMedida = medidas.find((m) => m.defaultMedida);

                // Encuentra el PVP (Precio de Venta al Público) predeterminado.
                const dataPVP = dataMedida?.pvps.find(pvp => (pvp.default));

                // Extrae información de impuestos relacionada con el producto.
                const { idTarifaImpuesto, codigo, porcentaje } = dataPopulatedTax.taxRates[product.codigoPorcentaje];
                const { idImpuesto } = dataPopulatedTax.taxes[codigo];

                let idMedida = 0, idTarifa = 0, precioVenta = 0, precioConIVA = 0;

                if (dataMedida) {
                    idMedida = dataMedida.idMedida;
                }
                if (dataPVP) {
                    idTarifa = dataPVP.idTarifa;
                    precioVenta = dataPVP.precioVenta;
                    precioConIVA = dataPVP.precioConIva
                } else {
                    console.log(dataPVP)
                    notify({
                        type: ToastType.Error,
                        content: "Error al cargar el PVP"
                    })
                    return
                }

                //Calcula el valor del impuesto aplicado al precio de venta.
                const taxValue = pricingCalculateUtil.calculateTaxValue(precioVenta, porcentaje);
                const newItem: OrderItem = {
                    uuid: generateUuidv4(),
                    itemTypeCode: item.itemTypeCode,
                    id: 0,
                    itemId: item.id,
                    menuId: item.menuId,
                    taxId: idImpuesto,
                    taxPercentId: idTarifaImpuesto,
                    feeId: idTarifa,
                    taxValue: roundNumber(taxValue, 5),
                    quantity: 1,
                    cost: product.precioCosto,
                    price: precioVenta,
                    discount: 0,
                    total: precioVenta + taxValue,
                    obs: "",
                    bodegaId: getBodegaId(),
                    medidaId: idMedida,

                    codigoTarifaImpuesto: codigo,
                    taxPercent: porcentaje,
                    //Campos adicionales
                    summary: item.summary,
                    productId: product.idArticulo,
                    code: product.codigoArticulo,
                    precioConIVA: precioConIVA,
                    precioTotalSinImpuesto: precioVenta,
                    medida: item.medida,
                    descripcion: item.descripcion,
                    llevaInventario: true,
                    s3ObjectUrl: item.s3ObjectUrl,
                    medidas,
                    pvps: dataMedida && dataMedida.pvps || [],
                    consolidacionesFecha,
                }

                // Verifica si el producto no lleva inventario y agrega el artículo al carrito.
                if (!product.llevaInventario) {
                    cartStore.addToCartItem(newItem);
                    return
                }

                // Encuentra el índice del artículo de pedido en el carrito según el ID del producto.
                const findIndexByProductId = cartStore.order.items.findIndex(item => item.llevaInventario && item.productId === product.idArticulo);


                if (findIndexByProductId === -1) {
                    showLoader();
                    productSvc.checkStock({
                        idArticulo: product.idArticulo,
                        idBodega: getBodegaId(),
                        cantidad: -1
                    }).then(async response => {
                        hideLoader();
                        const { code, message, titleSms } = response;

                        // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
                        if (code === "1") {
                            cartStore.addToCartItem(newItem);
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
                            if (code === "0") {
                                return
                            }
                            if (code === "2") {
                                // Si el código es "2", solo realiza cálculos totales.
                                cartStore.addToCartItem(newItem);
                            }
                        }
                    })
                }

                if (findIndexByProductId !== -1) {
                    const dataOrderItem = cartStore.order.items[findIndexByProductId];
                    const tempDataOrderItem = structuredClone(dataOrderItem);

                    // Incrementa la cantidad del artículo de pedido en 1.
                    tempDataOrderItem.quantity += 1;
                    tempDataOrderItem.consolidacionesFecha = consolidacionesFecha;

                    // Obtiene la cantidad de stock disponible para el artículo.
                    const cantidadStock = getCantidadStock(tempDataOrderItem, cartStore.order.createdAt);

                    if (cantidadStock === 0) {
                        cartStore.updateCartItem(tempDataOrderItem);
                        return
                    }


                    showLoader();
                    productSvc.checkStock({
                        idArticulo: tempDataOrderItem.productId,
                        idBodega: tempDataOrderItem.bodegaId,
                        cantidad: cantidadStock,
                    }).then(async response => {
                        hideLoader();
                        const { code, message, titleSms } = response;

                        // Si el código es "1", no hay problemas de stock, realiza cálculos totales.
                        if (code === "1") {
                            cartStore.updateCartItem(tempDataOrderItem);
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
                            if (code === "0") {
                                tempDataOrderItem.quantity = dataOrderItem.quantity;
                                cartStore.updateCartItem(tempDataOrderItem); 
                                return
                            }
                            if (code === "2") {
                                // Si el código es "2", solo realiza cálculos totales.
                                cartStore.updateCartItem(tempDataOrderItem); 

                            }
                        }
                    })
                }
            })

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            notify({
                type: ToastType.Error,
                content: errorMessage
            });
        }
    }
    return (
        <>
            {items.map((item, index) => (
                <Grid item xs={2} sm={3} md={4} lg={4} key={index}>
                    <ItemCard item={item} onClick={() => handleAddToCart(item)} />
                </Grid>
            ))}
        </>
    );
};

export default ItemList;
