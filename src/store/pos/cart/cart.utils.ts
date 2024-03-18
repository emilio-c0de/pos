import { OrderItem } from "@/models/order.model.ts";
import { pricingCalculateUtil } from "@/utils/pricing-calculate.util";

export function getCantidadStock(orderItem: OrderItem, fechaEmision: Date) { 
    const fechaEmisionValidate = fechaEmision;
    let cantidadStock = 1;
    const dataMedida = orderItem.medidas.find(m => (m.idMedida === orderItem.medidaId));
    if (dataMedida) {
        cantidadStock = orderItem.quantity * dataMedida.conversion;
    }
    const dataConsolidacionFecha = orderItem.consolidacionesFecha.find(
        cdataFecha => cdataFecha.idBodega === orderItem.bodegaId
    )

    if (dataConsolidacionFecha && dataConsolidacionFecha.fechaConsolidacion) {
        if (dataConsolidacionFecha.fechaConsolidacion >= fechaEmisionValidate) {
            return 0;
        }
    }

    const resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;
    return resultCantStock;

}


export const getCalculateTotalDetalle = (orderItem: OrderItem)=>{
    const precioTotalSinImpuesto = ((orderItem.price * orderItem.quantity)) - orderItem.discount;
    const valorImpuesto = pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, orderItem.taxPercent);
    const total = precioTotalSinImpuesto + valorImpuesto;  
    return {
        precioTotalSinImpuesto,
        valorImpuesto,
        total
    }
}

 