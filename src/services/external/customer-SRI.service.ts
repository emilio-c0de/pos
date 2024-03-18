 
import { CustomerCedulaSRI, CustomerRucSRI } from "@/models/external/customerSRI.model";
import { PATHS_API } from "@/constants/constants";
import { http } from "@/utils/http";


export const checkClientSRIByRUC = async (identificacion: string): Promise<CustomerRucSRI> => {
    const resultAxios = await http({
        method: 'get',
        url: `${PATHS_API.CONSULTA}GetRucSRI`,
        params: {
            Ruc: identificacion
        }
    })
    return resultAxios.data;
}

export const checkClientSRIByCedula = async (identificacion: string): Promise<CustomerCedulaSRI> => {
    const resultAxios = await http({
        method: 'get',
        url: `${PATHS_API.CONSULTA}GetCedulaSri`,
        params: {
            Ruc: identificacion
        }
    })
    return resultAxios.data;
}