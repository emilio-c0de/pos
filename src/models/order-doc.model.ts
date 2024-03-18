export interface OrderDocRaw {
    codEstab: string
    idCuentaPorCobrar:  number
    documentoId:  number
    orderId:  number
    docType: "NE",
    serie: string
    serieComprobante: string
    createAt:string
    customerName: string
    userName: string
    tiempoCredito: true,
    importeTotal:  number
    abono: number
    saldo:  number
    estado:string
    telefono: string
    telefonoEstablecimiento: string
    nombreComercial: string
    codEstado: string
}