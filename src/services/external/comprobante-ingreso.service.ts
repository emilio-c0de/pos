import { PATHS, PATHS_API } from "@/constants/constants"
import { http } from "@/utils/http"

class ComprobanteIngresoService {
    private readonly url = `${PATHS_API.ACCOUNTING}${PATHS.COMPROBANTE_INGRESO}`

    async post<T>(data: T){
        const resultAxios = await http({
            method: 'post',
            url: `${this.url}Insert`,
            data :{
                data
            }
        })
        return resultAxios.data;
    }
}


export const comprobanteIngresoSvc = new ComprobanteIngresoService()