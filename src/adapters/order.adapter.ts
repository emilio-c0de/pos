import { Order, OrderItem, OrderItemPost, OrderItemUpdateDto, OrderPost, OrderRead, OrderUpdateDto } from "@/models/order.model";

import { productAdapter } from "./product.adapter";

class OrderAdapter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllFrom(orders: any): Array<OrderRead> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results = orders.map((data: any) => ({
            id: data.id,
            establecimientoId: data.establecimientoId,
            codEstab: data.codEstab,
            telefonoEstablecimiento: data.telefonoEstablecimiento,
            nombreComercialEstab: data.nombreComercialEstab,
            puntoEmisionId: data.puntoEmisionId,
            appTableId: data.appTableId,
            tableId: data.tableId,
            sequence: data.sequence,
            serie: data.serie,
            customerCompanyId: data.customerCompanyId,
            telefonoCliente: data.telefonoCliente,
            tax: data.tax,
            discount: data.discount,
            tip: data.tip,
            total: data.total,
            obs: data.obs,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            enabled: data.enabled,
            deleted: data.deleted,
            userId: data.userId,
            uuid: data.uuid,
            razonSocialComprador: data.nameFiscal,
            userName: data.userName,
            totalRecords: data.totalRecords,
            divided: data.divided,
            finished: data.finished,
            tableName: data.tableName,
        }))
        return results;
    }

    postTo(order: Order): OrderPost {
        const items = this.itemsTo(order.items);
        const data = {
            uuid: order.uuid,
            items,
            establecimientoId: order.establecimientoId,
            puntoEmisionId: order.puntoEmisionId,
            tableId: order.tableId,
            customerCompanyId: order.customerCompanyId,
            tax: order.tax,
            discount: order.discount,
            tip: order.tip,
            total: order.total,
            obs: order.obs,
            userId: order.userId,
            taxPercentId: 0
        }
        return data;
    }

    getIdFrom(data: any): { order: OrderUpdateDto } {
        const { order, orderItems } = data;

        const orderItemsMapper: OrderItemUpdateDto[] = orderItems.map((orderItem: any) => {

            //let pvps: Array<ProductPVPReadDto> = [];

            const { medidasFraccionado, medidasPrincipal, ...restOrderItem } = orderItem;

            // Medidas del artículo fraccionado del principal
            const medidasFraccionadoTemp = JSON.parse(medidasFraccionado) || [];

            // Medida principal con las tarifas
            const medidasPrincipalTemp = JSON.parse(medidasPrincipal) || [];

            /**
             * Combinar los dos arrays de medidas en uno solo
             *
             * Parámetros:
             *  - mergedMedidasArray: El array resultante de la combinación de los dos arrays de medidas
             */
            const mergedMedidasArray = [...medidasFraccionadoTemp, ...medidasPrincipalTemp];

            /**
             * Ordenar el array de medidas en función de la propiedad "orden" y
             * establecer la propiedad "defaultMedida" en falso para todos los elementos
             *
             * Parámetros:
             *  - orderMedidaArray: El array de medidas ordenado
             */
            const orderMedidaArray = mergedMedidasArray.sort((a, b) => a.orden - b.orden).map(medida => ({
                ...medida,
                defaultMedida: false
            }));

            // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
            orderMedidaArray[0].defaultMedida = true;

            const measures = productAdapter.medidaTarifaAdapter(orderMedidaArray)

            /**
             * Obtener los datos de la medida
             *
             * Parámetros:
             *  - orderMedidaArray: El array de medidas ordenado
             *  - restItem: El artículo
             *
             * Devuelve:
             *  - Los datos de la medida, o un objeto vacío si la medida no se encuentra
             */
            const dataMedida = measures.find(m => m.idMedida === restOrderItem.medidaId);

            const obj: OrderItemUpdateDto = {
                productId: restOrderItem.idArticulo,
                id: restOrderItem.id,
                uuid: restOrderItem.uuid,
                orderId: restOrderItem.orderId,
                itemId: restOrderItem.itemId,
                itemTypeId: restOrderItem.itemTypeId,
                taxId: restOrderItem.taxId,
                taxPercentId: restOrderItem.taxPercentId,
                taxValue: restOrderItem.taxValue,
                quantity: restOrderItem.quantity,
                cost: restOrderItem.cost,
                price: restOrderItem.price,
                discount: restOrderItem.discount,
                total: restOrderItem.total,
                obs: restOrderItem.obs ?? "",
                feeId: restOrderItem.feeId,
                bodegaId: restOrderItem.bodegaId,
                descripcion: restOrderItem.descripcion,
                summary: restOrderItem.summary,
                code: restOrderItem.codigoArticulo,
                s3ObjectUrl: restOrderItem.s3ObjectUrl,
                llevaInventario: restOrderItem.llevaInventario,
                precioConIVA: restOrderItem.priceWithVat,
                pvps: dataMedida && dataMedida.pvps || [], // Asignar los datos de las tarifas obtenidos de data medida 
                medidaId: restOrderItem.medidaId,
                medidas: measures,
                codigoTarifaImpuesto: restOrderItem.taxRateCode,
                taxPercent: restOrderItem.taxPercent,
                menuId: restOrderItem.menuId,
                itemTypeCode: restOrderItem.itemTypeCode,
                remainingQuantity: restOrderItem.remainingQuantity,
                medida: restOrderItem.medida,
                precioTotalSinImpuesto: restOrderItem.precioTotalSinImpuesto,
                consolidacionesFecha: []
            }
            return obj;

        })

        const orderMapper: OrderUpdateDto = {
            customerName: order.customerName,
            tableName: order.tableName,
            orderId: order.id,
            uuid: order.uuid,
            establecimientoId: order.establecimientoId,
            puntoEmisionId: order.puntoEmisionId,
            tableId: order.tableId,
            serie: order.serie,
            customerCompanyId: order.customerCompanyId,
            tax: order.tax,
            discount: order.discount,
            tip: order.tip,
            total: order.total,
            obs: order.obs,
            divided: order.divided,
            createdAt: order.createdAt,
            userId: order.userId,
            items: orderItemsMapper
        }


        return {
            order: orderMapper,
        }


    }

    private itemsTo(items: OrderItem[]): OrderItemPost[] {
        const results = items.map(item => {
            return {
                uuid: item.uuid,
                itemTypeCode: item.itemTypeCode,
                menuId: item.menuId,
                itemId: item.itemId,
                taxId: item.taxId,
                taxPercentId: item.taxPercentId,
                feeId: item.feeId,
                taxValue: item.taxValue,
                quantity: item.quantity,
                cost: item.cost,
                price: item.price,
                discount: item.discount,
                total: item.total,
                obs: item.obs,
                bodegaId: item.bodegaId,
                medidaId: item.medidaId
            }
        })
        return results;
    }

    putTo() {

    }

}

export const orderAdapter = new OrderAdapter();