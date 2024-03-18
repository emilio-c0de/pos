import { cuentaPorCobrarAdapter } from "@/adapters/cuenta-por-cobrar.adapter";
import { PATHS, PATHS_API } from "@/constants/constants";
import { CuentaPorCobrar, CuentaPorCobrarComprobante } from "@/models/external/cuenta-por-cobrar.model";
import { http } from "@/utils/http";

class CuentaPorCobrarService {
    private readonly url = `${PATHS_API.ACCOUNTING}${PATHS.CUENTA_POR_COBRAR}`
    async getDataPayment<T extends { idCuentaPorCobrar: number, codEstab: string }>(data: T) {
        const json = JSON.stringify({
            ...data,
            tipo: 3
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}`,
            params: {
                json
            }
        })


        const response = resultAxios.data;
        if (response!==null && typeof response!=='object') throw response;

        const { entidadFinanciera, banco, subEntidadFinanciera, provincia } = response;

        let cuentasPorCobrar: Array<CuentaPorCobrar> = [], comprobante = {} as CuentaPorCobrarComprobante;

        //cuando el cobro es por documento 
        if (data.idCuentaPorCobrar && data.idCuentaPorCobrar > 0 && response.cuentaPorCobrar) {
            cuentasPorCobrar = cuentaPorCobrarAdapter.getDataFrom(response.cuentaPorCobrar)

        }

        if (cuentasPorCobrar.length > 0) {
            const dataCuentaPorCobrar = cuentasPorCobrar[0]
            comprobante = cuentaPorCobrarAdapter.getDataComprobante(dataCuentaPorCobrar)
        }

        const resultMapper = {
            paymentTypes: cuentaPorCobrarAdapter.paymentTypeAdapter(entidadFinanciera, subEntidadFinanciera),
            banks: cuentaPorCobrarAdapter.bankAdapter(banco),
            cities: cuentaPorCobrarAdapter.cityAdapter(provincia),
            cuentasPorCobrar: cuentasPorCobrar,
            comprobante
        }
        return resultMapper;


    }
}

export const cuentaPorCobrarSvc = new CuentaPorCobrarService();