import { Decimal } from "@/models/decimal.model";



function readFrom(decimal: Decimal): Decimal {
    return ({
        nroPrecio: Number(decimal.nroPrecio),
        nroCantidad: Number(decimal.nroCantidad),
        nroIva: Number(decimal.nroIva),
        nroDescuentoDetalle: Number(decimal.nroDescuentoDetalle),
        nroTotalDetalle: Number(decimal.nroTotalDetalle),
        nroTotalSubTotal: Number(decimal.nroTotalSubTotal),
        nroDescuento: Number(decimal.nroDescuento),
        importeTotal: Number(decimal.importeTotal),
        nroIce: Number(decimal.nroIce)
    })
}

export const decimalAdapter = {
    readFrom
}