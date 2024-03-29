import { formatDateMoment } from "@/utils/format-date-moment"

export interface OrderDataFilter {
    tableId:  number
    pageIndex:  number
    pageSize:  number
    fromDate: string
    toDate: string
    customerCompanyId:  number
    codEstab: string,
    idPuntoEmision:  number
    userId: number
    tipoOrden: string | "SD" | 'CD'
}

export const initialOrderDataFilter: OrderDataFilter = {
    tableId: 0,
    pageIndex: 1,
    pageSize: 25,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    customerCompanyId: 0,
    codEstab: '',
    idPuntoEmision: 0,
    userId: 0,
    tipoOrden: "SD"
}