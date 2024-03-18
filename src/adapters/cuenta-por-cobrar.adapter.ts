import { Bank, RawBankData } from "@/models/external/bank.model";
import { City, RawCityData } from "@/models/external/city.model";
import { CuentaPorCobrar, CuentaPorCobrarAPI, CuentaPorCobrarComprobante, CuotaAPI } from "@/models/external/cuenta-por-cobrar.model";
import { PaymentSubType, PaymentType, RawPaymentSubType, RawPaymentType } from "@/models/external/payment-type.model";

class CuentaPorCobrarAdapter {

    getDataFrom(cuentaPorCobrar: CuentaPorCobrarAPI[]): CuentaPorCobrar[] {
        return cuentaPorCobrar.map((cxc) => {
            const cuotas: CuotaAPI[] = JSON.parse(cxc.cuotas);
            const resultsCuotas = cuotas.map((cuota) => ({
                idCuotaPorCobrar: cuota.idCuotaPorCobrar,
                idCuentaPorCobrar: cuota.idCuentaPorCobrar,
                nroCuota: cuota.nroCuota,
                cuota: cuota.cuota,
                mora: cuota.mora,
                interes: cuota.interes,
                diasMora: cuota.diasMora,
                abono: cuota.abono,
                saldoCta: cuota.saldoCta,
                saldo: cuota.saldo,
                estado: cuota.estado,
                saldoOriginal: cuota.saldo
            }));

            return {
                codEstab: cxc.codEstab,
                idCliente: cxc.idCliente,
                identificacionComprador: cxc.identificacionComprador,
                razonSocialComprador: cxc.razonSocialComprador,
                idCuentaPorCobrar: cxc.idCuentaPorCobrar,
                serieComprobante: cxc.serieComprobante,
                codDoc: cxc.codDoc,
                fechaEmision: cxc.fechaEmision,
                fechaVencimiento: cxc.fechaVencimiento,
                importeTotal: cxc.importeTotal,
                diasMora: cxc.diasMora,
                mora: cxc.mora,
                abono: cxc.abono,
                saldo: cxc.saldo,
                saldoDoc: cxc.saldo,
                descripcion: cxc.descripcion,
                cuotas: structuredClone(resultsCuotas),
                cuotasOriginal: structuredClone(resultsCuotas)
            };
        });
    }

    getDataComprobante(dataCuentaPorCobrar: CuentaPorCobrar): CuentaPorCobrarComprobante {
        return {
            codEstab: dataCuentaPorCobrar.codEstab,
            idCliente: dataCuentaPorCobrar.idCliente,
            identificacionComprador: dataCuentaPorCobrar.identificacionComprador,
            razonSocialComprador: dataCuentaPorCobrar.razonSocialComprador,
            serieComprobante: dataCuentaPorCobrar.serieComprobante,
            importeTotal: dataCuentaPorCobrar.importeTotal,
            saldo: dataCuentaPorCobrar.saldo,
            abono: dataCuentaPorCobrar.abono,
            fechaEmision: dataCuentaPorCobrar.fechaEmision
        }
    }


    paymentTypeAdapter(paymentTypes: RawPaymentType[], paymentSubTypes: RawPaymentSubType[]): Array<PaymentType> {
        const resultado = paymentTypes.map(paymentType => {
            const idEntidadFinanciera = paymentType.idEntidadFinanciera;
            const mapperPaymentSubTypes = paymentSubTypes.filter(paymentSubType => paymentSubType.idEntidadFinanciera === idEntidadFinanciera);

            const obj = {
                paymentTypeId: paymentType.idEntidadFinanciera,
                code: paymentType.codigo,
                description: paymentType.descripcion,
                paymentSubTypes: this.paymentSubTypeAdapter(mapperPaymentSubTypes)

            }
            return obj;
        });
        return resultado;
    }

    paymentSubTypeAdapter(paymentSubTypes: RawPaymentSubType[]): Array<PaymentSubType> {
        return paymentSubTypes.map(paymentSubType => ({
            paymentSubTypeId: paymentSubType.idSubEntidadFinanciera,
            paymentTypeId: paymentSubType.idEntidadFinanciera,
            code: paymentSubType.codigo,
            description: paymentSubType.descripcion,
            isControlBox: paymentSubType.controlCaja
        }))
    }

    bankAdapter(banks: RawBankData[]): Array<Bank> {
        return banks.map(bank => ({
            bankId: bank.idBanco,
            description: bank.descripcion,
            code: bank.codigo
        }))
    }

    cityAdapter(cities: RawCityData[]): Array<City> {
        return cities.map(city => ({
            cityId: city.idCiudad,
            description: city.descripcion,
            province: city.provincia,
            code: city.codigo
        }))
    }

}

export const cuentaPorCobrarAdapter = new CuentaPorCobrarAdapter();
