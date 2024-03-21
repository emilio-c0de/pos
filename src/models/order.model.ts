import { Tarifa } from "./external/tarifa.model";
import { ConsolidacionFecha, Medida } from "./medida.model"

export type OrderItem = {
    uuid: string;
    itemTypeCode: string;
    itemTypeId?: number
    id: number;
    menuId: number;
    itemId: number;
    taxId: number; // idImpuesto
    taxPercentId: number; // idTarifaImpuesto/idTipoIva
    feeId: number; // idTarifa
    taxValue: number;
    quantity: number;
    remainingQuantity?: number // se usa en division 
    cost: number;
    price: number;
    discount: number;
    total: number;
    obs?: string;
    bodegaId: number;
    medidaId: number;

    codigoTarifaImpuesto: string // codigo de tarifa impuesto (tipo iva)
    taxPercent: number //Tarifa o procentaje del tipo iva (tarifa impuesto)
    //Campos Adicionales 
    summary?: string
    productId: number
    code: string
    precioConIVA: number
    precioTotalSinImpuesto: number
    medida: string
    descripcion: string;
    llevaInventario: boolean;
    s3ObjectUrl?: string;
    medidas: Medida[];
    pvps: Tarifa[]
    consolidacionesFecha: ConsolidacionFecha[]
    envioSri?: boolean
    paid?: boolean
}

export type Order = {
    uuid: string
    orderId: number
    userId: number
    customerCompanyId: number
    customerName: string
    createdAt: Date
    subtotalSinImpuestos: number
    items: Array<OrderItem>
    customDetail?: Array<OrderItem>
    itemsToPay?: Array<OrderItem>
    tableId: number
    obs?: string | null
    tableName?: string
    establecimientoId: number
    puntoEmisionId: number
    codDoc?: string
    tax: number
    discount: number
    tip: number
    total: number
    quickSale?: boolean
    bodegaId?: number
    saveDoc?:boolean
    updateOrder?:boolean
}


// export interface PosOrderItem
//     extends Omit<
//         OrderItem,
//         | "descripcion"
//         | "medida"
//         | "llevaInventario"
//         | "s3ObjectUrl"
//         | "medidas"
//         | "pvps"
//         | "consolidacionesFecha"
//     > { }


/**
 * 
 * TODO RELACIONADO A LEER, GUARDAR Y ACTUALIZAR A LA BASE DE DATOS 
 * 
 * 
 */

//Leer Orden (Listado de Ordenes)
export interface OrderRead {
    id: number
    establecimientoId: number
    codEstab: string
    telefonoEstablecimiento: string
    nombreComercialEstab: string
    puntoEmisionId: number
    appTableId: number
    tableId: number
    sequence: number
    serie: string
    customerCompanyId: number
    telefonoCliente: string
    tax: number
    discount: number
    tip: null,
    total: number
    obs: string
    createdAt: string
    updatedAt: null,
    enabled: boolean
    deleted: null,
    userId: 115,
    uuid: string
    razonSocialComprador: string
    userName: string
    totalRecords: number
    divided: boolean
    finished: boolean
    tableName: string
}

//Guardar Orden 
export interface OrderItemPost {
    uuid: string
    itemTypeCode: string
    menuId: number
    itemId: number
    taxId: number
    taxPercentId: number
    feeId: number
    taxValue: number
    quantity: number
    cost: number
    price: number
    discount: number
    total: number
    obs?: string | null
    bodegaId: number
    medidaId: number

}
export interface OrderPost {
    uuid: string,
    items: Array<OrderItemPost>,
    customDetail?: Array<OrderItem>
    itemsToPay?: Array<OrderItem>
    establecimientoId: number
    puntoEmisionId: number
    tableId: number
    subtotalSinImpuestos: number
    codDoc?: string
    customerCompanyId: number
    tax: number
    discount: number
    tip: number
    total: number
    obs?: string | null,
    userId: number
    taxPercentId: number
    quickSale?: boolean
    saveDoc?: boolean
    updateOrder?: boolean,
    taxes: []
}

export interface OrderToSaveReturnData {
    codEstab: string
    idCuentaPorCobrar: number
    orderId: number,
    idDocumento: number,
    payAutomatic: boolean,
    printerAutomatic: boolean
}
 