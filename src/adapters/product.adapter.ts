import { ConsolidacionFecha, Medida, MedidaApiResponse } from "@/models/medida.model.ts"
import { Product, ProductSearchDto, ProductSearchRawDto } from "@/models/external/product.model"
import { Tarifa, TarifaApiResponse } from "@/models/external/tarifa.model"

type SaleFromProps = {
    product: Product
    medidas: Array<MedidaApiResponse & { defaultMedida: boolean, tipo: "FRACCIONADO" | "PRINCIPAL" }>
    consolidacionesFecha: Array<ConsolidacionFecha>
}
const saleFrom = (data: SaleFromProps) => {
    const { product, medidas, consolidacionesFecha } = data;

    /**
    * Ordenar el array de medidas en función de la propiedad "orden" y 
    * establecer la propiedad "defaultMedida" en falso para todos los elementos 
    * */
    const orderMedidaArray = medidas.sort((a, b) => a.orden - b.orden).map(medida => ({
        ...medida,
        defaultMedida: false
    }))
    // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
    orderMedidaArray[0].defaultMedida = true;

    const resultMedida: Array<Medida> = medidaTarifaAdapter(orderMedidaArray)

    consolidacionesFecha.map(data => {
        return {
            ...data,
            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
        }
    })

    return {
        product,
        medidas: resultMedida,
        consolidacionesFecha
    }
}


const searchFrom = (products: Array<ProductSearchRawDto>): Array<ProductSearchDto> => {

    const results = products.map(product => {
        const tempTarifas: Array<TarifaApiResponse> = JSON.parse(product.priceSale) || []
        const tarifas: Array<Tarifa> = tempTarifas.map(tarifa => ({
            idTarifa: tarifa.idTarifa,
            descripcion: tarifa.tarifa,
            precioVenta: tarifa.precioVenta,
            precioConIva: tarifa.precioConIva,
            default: tarifa.predeterminada
        }))
        return {
            idArticulo: product.idArticulo,
            codigo: product.codigo,
            descripcion: product.descripcion,
            iva: product.iva,
            tarifas: tarifas,
            s3ObjectUrl: product.s3ObjectUrl,
        }
    })
    return results;
}

const medidaTarifaAdapter = (medidas: any[]): Array<Medida> => {

    return medidas.map(medida => {
        let pvps: TarifaApiResponse[] = [];
        if (typeof medida.tarifas === 'string') {
            pvps = JSON.parse(medida.tarifas);
        } else {
            pvps = medida.tarifas;
        }

        return {
            idMedida: medida.idMedida,
            descripcion: medida.descripcion,
            conversion: medida.conversion,
            defaultMedida: medida.defaultMedida,
            tipo: medida.tipo,
            pvps: pvps.map(pvp => ({
                idTarifa: pvp.idTarifa,
                precioVenta: pvp.precioVenta,
                precioConIva: pvp.precioConIva,
                descripcion: pvp.tarifa,
                default: pvp.predeterminada
            }))
        }
    })
}


export const productAdapter = {
    saleFrom,
    searchFrom,
    medidaTarifaAdapter
}