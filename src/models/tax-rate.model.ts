import { TAX_RATE_CODE } from "@/constants/constants"

export interface TaxRate {
    idImpuesto: number
    idTarifaImpuesto: number,
    codImpuesto: string,
    codigo: TAX_RATE_CODE.DIFFERENTIATED_TAX
    | TAX_RATE_CODE.FOURTEEN_PERCENT
    | TAX_RATE_CODE.NOT_SUBJECT_TO_TAX
    | TAX_RATE_CODE.TAX_EXEMPT
    | TAX_RATE_CODE.TWELVE_PERCENT
    | TAX_RATE_CODE.ZERO_PERCENT
    descripcion: string,
    porcentaje: number,
    estado: boolean
}