import { SRI_IDENTIFICATION_CODE } from "@/constants/constants";

 
type CodigoIdentificacionSRI = SRI_IDENTIFICATION_CODE.RUC | SRI_IDENTIFICATION_CODE.CEDULA | SRI_IDENTIFICATION_CODE.PASSPORT;
type CodigoIdentificacion = SRI_IDENTIFICATION_CODE.RUC | SRI_IDENTIFICATION_CODE.CEDULA | SRI_IDENTIFICATION_CODE.PASSPORT

export interface TipoIdentificacion {
    codigoSri: CodigoIdentificacionSRI,
    codigo: CodigoIdentificacion,
    idTipoIdentificacion: number,
    descripcion: string
}