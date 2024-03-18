import { MultiplesPaymentType, PaymentDetail, PaymentHistory } from "@/store/payment/type"
import { roundNumber } from "@/utils/round-number.util"

 
type Comprobante = {
    idCliente: number
    total: number
    abono: number
    codEstab: string
    numeroIdentificacion: string
    nombreFiscal: string
}

type PostTo<T, U, V, W> = {
    comprobante: T,
    multiplesPaymentType: U[],
    paymentDetails: V[],
    historialCuentas: W[]
}
 
class ComprobanteIngresoAdapter {

    postTo(obj: PostTo<Comprobante, MultiplesPaymentType, PaymentDetail, PaymentHistory>){
        const {
            comprobante,
            multiplesPaymentType,
            paymentDetails,
            historialCuentas,
        } = obj;

        const comprobanteMappeado = {
            idCliente: comprobante.idCliente,
            total: comprobante.total,
            abono: comprobante.abono,
            codEstab: comprobante.codEstab,
            numeroIdentificacion: comprobante.numeroIdentificacion,
            nombreFiscal: comprobante.nombreFiscal
        }

        const comprosMappeado = multiplesPaymentType.map(item => {

            const obj = {
                idEntidadFinanciera: item.paymentTypeId,
                idSubEntidadFinanciera: item.paymentSubTypeId,
                idBanco: item.idBanco,
                idCuentaBancaria: 0,
                fechaEmision: item.creationDate,
                valor: item.receivedAmount,
                posfechado: item.posfechado,
                secuencial: item.sequential,
                infoCobro: item.infoCobro,
                abono: item.payingAmount,
                controlCaja: item.isControlBox,
            }
            return obj;
        })

        const cobroDetalleMappeado = paymentDetails.map(detalle => {
            return {
                idCuentaPorCobrar: detalle.idCuentaPorCobrar,
                idCuotaPorCobrar: detalle.idCuotaPorCobrar,
                abono: detalle.abono,
                interes: detalle.interes,
                diasMora: detalle.diasMora,
                mora: detalle.mora,
                cuota: detalle.cuota,
                saldo: detalle.saldoOriginal,
                secuencial: detalle.secuencial,
            }
        })

        const historialCobrosMappeado = historialCuentas.map(hc => {
            return {
                idCuentaPorCobrar: hc.idCuentaPorCobrar,
                abono: roundNumber(hc.abono, 5),
                diasMora: hc.diasMora,
                mora: hc.mora,
                saldo: roundNumber(hc.saldo, 5),
                secuencial: hc.secuencial
            }
        })

        const objComprobanteIngreso = {
            comprobante: comprobanteMappeado,
            cobros: comprosMappeado,
            cobroDetalle: cobroDetalleMappeado,
            historial: historialCobrosMappeado,
        }
        return objComprobanteIngreso;
    }
}

export const comprobanteIngresoAdapter = new ComprobanteIngresoAdapter();
