
export interface TiempoCredito {
    idTiempoCredito: number,
    descripcion: string,
    diasCredito: number
    numeroCuota: number
    entrada: boolean
    tipo: boolean
}

export interface CreditTimeSelectHtmlOnly extends Pick<TiempoCredito, 'idTiempoCredito' | 'descripcion'> { }