import { productAdapter } from "@/adapters/product.adapter";
import { PATHS, PATHS_API } from "@/constants/constants";
import { ApiResponse } from "@/models/api-response";
import { http } from "@/utils/http";
import { sanitizeAndEncodeURIComponent } from "@/utils/utils";


class ProductService {
    private readonly url = `${PATHS_API.INVENTORY}${PATHS.PRODUCT}`

    async getForSale(productId: number, bodegaId?: number) {

        const json = JSON.stringify({
            idArticulo: productId,
            idBodega: bodegaId,
            tipo: 10
        })

        const resultAxios = await http({
            method: 'get',
            url: `${this.url}Get`,
            params: {
                json
            }
        });

        const response: ApiResponse = resultAxios.data;
        // let product = {} as ProductSaleReadDto
        // let measures: Array<Measure> = [];
        // let consolidacionesFecha: Array<ConsolidacionFecha> = [];


        if (response.code === '0') {
            throw response;
        }
        const repositoryData = JSON.parse(response.payload as string);

        const [productRepos, medidaFraccionadaRepos, medidaPrincipalRepos, consolidacionesFechaRepos] = repositoryData;

        const product = productRepos[0];

        // Combinar los dos arrays de medidas en uno solo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const medidasPrincipal = medidaPrincipalRepos.map((medidaPrincipal: any) => ({
            ...medidaPrincipal,
            tipo: 'PRINCIPAL'
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const medidasFraccionado = medidaFraccionadaRepos.map((medidaFraccionado: any) => ({
            ...medidaFraccionado,
            tipo: 'FRACCIONADO'
        }))

        const mergedMedidasArray = [...medidasPrincipal, ...medidasFraccionado];

        const resultData = productAdapter.saleFrom({
            product,
            medidas: mergedMedidasArray,
            consolidacionesFecha: consolidacionesFechaRepos
        })

        return resultData;
    }


    async checkStock(obj: { idArticulo: number, cantidad: number, idBodega: number }): Promise<ApiResponse> {
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}Get`,
            params: {
                json: JSON.stringify(Object.assign(obj, { tipo: 7 }))
            }
        });

        const response: ApiResponse = resultAxios.data;

        if (response.code === '0') {
            throw response;
        }

        return JSON.parse(response.payload as string)[0][0];
    }


    async search(obj: { textSearch: string }) {
        const json = JSON.stringify({  
            pageIndex: 1,
            pageSize: 30, 
            busqueda: sanitizeAndEncodeURIComponent(obj.textSearch)
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}Search`,
            params: {
                json: json
            },
        })

        const response = resultAxios.data;
        const productsFound = JSON.parse(response.payload) || [];

        return productAdapter.searchFrom(productsFound)
    }
}


export const productSvc = new ProductService();