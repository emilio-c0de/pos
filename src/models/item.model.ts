import { ITEM_TYPE_CODE } from "@/constants/constants"

 

export interface ItemPVPApi {
    idTarifa: number,
    precioVenta: number,
    precioConIva: number,
    tarifa: string,
    precioPredeterminado: boolean
}

export interface ItemPVP {
    feeId: number
    salePrice: number
    priceWithVat: number
    description: string,
    default: boolean
}

export interface ItemApiResponse {
    id: number
    menuId: number
    summary?: string
    productId: number
    descripcion: string
    s3ObjectUrl?: string
    stock: number,
    codigo: string
    medida: string
    tipoIva: string
    costPrice: string
    pvp: string
    totalRecords: number
    itemTypeCode: ITEM_TYPE_CODE.MENU | ITEM_TYPE_CODE.ITEM
    idMedida: number
}

export interface Item {
    id: number
    menuId: number
    summary?: string
    productId: number
    descripcion: string
    s3ObjectUrl?: string
    stock: number,
    codigo: string
    medida: string
    tipoIva: string
    costPrice: string
    pvp: ItemPVP
    totalRecords: number
    itemTypeCode: ITEM_TYPE_CODE.MENU | ITEM_TYPE_CODE.ITEM
    idMedida: number
}