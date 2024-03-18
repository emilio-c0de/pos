import { companyCustomerAdapter } from "@/adapters/company-customer.adapter"
import { PATHS, PATHS_API } from "@/constants/constants"
import { ApiResponse, isApiResponse } from "@/models/api-response"
import { CompanyCustomer, CompanyCustomerRead, CompanyCustomerReadUpdate, CompanyCustomerSearchRead } from "@/models/company-customer.model"
import { http } from "@/utils/http"
import { isValidField } from "@/utils/utils"
import Swal from "sweetalert2"

class CompanyCustomerService {
    private readonly url = `${PATHS_API.FACT_ELECT}${PATHS.COMPANY_CUSTOMER}`

    async getDataForm() {
        const json = JSON.stringify({
            tipo: 2
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
        })

        const response = resultAxios.data;
        if (isApiResponse(response)) {
            if (response.code === "0") {
                throw response;
            }
            if (response.code === "1") {
                const mainData = JSON.parse(response.payload as string);

                return companyCustomerAdapter.getDataFormFrom(mainData)
            }
        }
    }

    async getAll<T extends { pageIndex: number, pageSize: number, textSearch: string | null }>(obj: T) {
        const textSearch = isValidField(obj.textSearch);
        const json = JSON.stringify({
            ...obj,
            checkTextSearch: typeof textSearch == 'string',
            textSearch: textSearch,
            tipo: 1
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
        })

        const response = resultAxios.data;

        let companyCustomers: Array<CompanyCustomerRead> = [];
        if (isApiResponse(response) && response.payload) {
            const [results] = JSON.parse(response.payload as string);
            if (Array.isArray(results)) {
                companyCustomers = results.map(item => companyCustomerAdapter.getAllFrom(item))
            }
        }
        return companyCustomers;
    }

    async post<T>(data: T): Promise<ApiResponse> {
        const resultAxios = await http({
            method: 'post',
            url: `${this.url}`,
            data: { data }
        })
        const response = resultAxios.data;

        return response;
    }
    async put(id: number, data: object): Promise<ApiResponse> {
        const resultAxios = await http({
            method: 'put',
            url: `${this.url}${id}`,
            data: { data }
        })
        const response = resultAxios.data;
        return response;
    }


    async delete(id: number) {
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}${id}`,
        })
        return resultAxios;
    }

    async getId(id: number): Promise<CompanyCustomerReadUpdate> {
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}GetId/${id}`,
        })
        const response = resultAxios.data;
        let data = {} as CompanyCustomerReadUpdate;
        if (isApiResponse(response)) {
            const mainData = JSON.parse(response.payload as string)[0] 
            data = companyCustomerAdapter.getIdFrom(mainData);
        }
        return data;
    }

    /**
     * 
     * @param query {tipo: 3, textSearch: '}
     * @returns devuelve true si el cliente esta registrado y sino false 
     */
    async isCustomerRegistered<T extends { textSearch: string }>(query: T): Promise<boolean> {
        let isRegistered = false;
        const json = JSON.stringify(Object.assign({ tipo: 3 }, query))
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
        })
        const response = resultAxios.data;
        if (isApiResponse(response) && response.payload) {
            isRegistered = true;
            const clienteRepository = JSON.parse(response.payload as string)[0][0];
            await Swal.fire({
                title: `Cliente Registrado`,
                html: `
                        <small><strong>Nro. Identificación</strong></small>
                        <br>
                        <p class="text-muted small">${clienteRepository.numeroIdentificacion}</p>
                        <small><strong>Nombre Fiscal</strong></small> <br>
                        <p class="text-muted small">${clienteRepository.nombreFiscal}</p>
    
                        <small><strong>Nombre Comercial</strong></small> <br>
                        <p class="text-muted small">${clienteRepository.nombreComercial}</p>
                    `,
                icon: 'info',
                focusConfirm: true,
                allowEscapeKey: true
            })
        }

        return isRegistered;
    }

    async search<T extends { textSearch: string }>(obj: T, signal?: AbortSignal) {


        const json = JSON.stringify(obj)
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}Search?json=${encodeURIComponent(json)}`,
            signal: signal
        })
        const response = resultAxios.data;
        let companyCustomers: Array<CompanyCustomerSearchRead> = [];
        if (isApiResponse(response)) {
            const results = JSON.parse(response.payload as string);
            companyCustomers = companyCustomerAdapter.searchFrom(results);
        }
        return companyCustomers;
    }


    /**
    * 
    * @param query {tipo: 3, textSearch: '}
    * @returns devuelve true si el cliente esta registrado y sino false 
    */
    async getByICard<T extends { textSearch: string }>(query: T): Promise<Partial<CompanyCustomer>> {
        const json = JSON.stringify(Object.assign({ tipo: 3 }, query));
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
            params: {
                json
            }
        })
        const response: ApiResponse = resultAxios.data;
        let data: Partial<CompanyCustomer> = {
            idCliente: 0,
            razonSocialComprador: "",
            nombreComercial: "",
            identificacionComprador: "",
            correo: "",
            telefonoComprador: "",
            direccionComprador: ""
        }

        if (isApiResponse(response) && response.payload) {
            const [results] = JSON.parse(response.payload as string);
            if (Array.isArray(results)) {
                const resultsMapped = companyCustomerAdapter.searchFrom(results)
                if (resultsMapped.length > 0) {
                    const tempData = resultsMapped[0];
                    data = {
                        idCliente: tempData.idCliente,
                        razonSocialComprador: tempData.razonSocialComprador,
                        nombreComercial: tempData.nombreComercial,
                        identificacionComprador: tempData.identificacionComprador,
                    }
                }
            }
        }
        return data;
    }
}


export const companyCustomerSvc = new CompanyCustomerService()