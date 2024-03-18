import { Bank } from '@/models/external/bank.model';
import { City } from '@/models/external/city.model';
import { CuentaPorCobrar, CuentaPorCobrarComprobante } from '@/models/external/cuenta-por-cobrar.model';
import { PaymentType } from '@/models/external/payment-type.model';

export interface PaymentData {
    paymentTypeId: number
    paymentSubTypeId: number
    creationDate: Date
    receivedAmount: number | string
    payingAmount: number
    sequential: number
    isControlBox: boolean
    paymentTypeCode: string
    paymentTypeDescription?: string
    nro?: string
    referencia?: string
    aprobacion?: string
    lote?: string
    cityId?: number | null
    idBanco?: number | null
    posfechado?: boolean
}


export interface PaymentDataForm {
    paymentTypes: Array<PaymentType>
    cuentasPorCobrar: Array<CuentaPorCobrar>
    banks: Array<Bank>
    cities: Array<City>
    comprobante: CuentaPorCobrarComprobante
}


export interface  PaymentSubTotal {
    importeTotal: number
    totalAbonoAnterior: number
    totalSaldo: number
    totalSaldoDoc: number,
    cambio: number
    totalValorAbono: number
    receivedAmount: number
}

/**
 * Datos cobro 
 */
export interface MultiplesPaymentType extends PaymentData {
    idCuentaBancaria: number | null
    paymentSubTypeName: string
    infoCobro?: string
}

// export interface PaymentData {
//     dataForm: PaymentDataForm
//     comprobante: CuentaPorCobrarComprobante
//     paymentData: PaymentData,
//     paymentSubTypes: Array<PaymentSubType>
//     dataSubTotal: CheckoutSubTotal
//     multiplesPaymentType: Array<MultiplesPaymentType>
//     paymentDetails: Array<PaymentDetail>
//     historialCuentas: Array<PaymentHistory>
// }

export interface PaymentDetail {
    idCuentaPorCobrar: number
    idCuotaPorCobrar: number,
    abono: number
    interes: number
    diasMora: number
    mora: number
    cuota: number
    saldo: number
    secuencial: number
    saldoOriginal: number
}

export interface PaymentHistory {
    idCuentaPorCobrar: number
    abono: number,
    diasMora: number
    mora: number,
    saldo: number
    secuencial: number
}


export const paymentDataInitialState: PaymentData = {
    paymentTypeId: 0,
    paymentSubTypeId: 0,
    creationDate: new Date(),
    receivedAmount: 0,
    payingAmount: 0,
    sequential: 0,
    isControlBox: false,
    paymentTypeCode: "",
    paymentTypeDescription: "",
    nro: "",
    referencia: "",
    aprobacion: "",
    lote: "",
    cityId: 0,
    idBanco: 0,
    posfechado: false
}


export const paymentDataFormInitialState: PaymentDataForm = {
    paymentTypes: [],
    cuentasPorCobrar: [],
    banks: [],
    cities: [],
    comprobante: {
        codEstab: '',
        idCliente: 0,
        identificacionComprador: '',
        razonSocialComprador: '',
        serieComprobante: '',
        importeTotal: 0,
        saldo: 0,
        abono: 0,
        fechaEmision: ''
    }
}

export const paymentSubTotalInitialState: PaymentSubTotal= {
    importeTotal: 0,
    totalAbonoAnterior: 0,
    totalSaldo: 0,
    totalSaldoDoc: 0,
    cambio: 0,
    totalValorAbono: 0,
    receivedAmount: 0
}