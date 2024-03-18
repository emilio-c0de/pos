export interface TarifaApiResponse {
    idTarifa: number
    precioVenta: number
    precioConIva: number
    tarifa: string
    ventaPorMayor: boolean
    predeterminada: boolean
}

export interface Tarifa {
    idTarifa: number;
    precioVenta: number;
    precioConIva: number;
    descripcion: string;
    default: boolean;
}