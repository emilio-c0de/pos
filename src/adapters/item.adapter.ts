
import { Item, ItemApiResponse, ItemPVP, ItemPVPApi } from "@/models/item.model";
import { ITEM_TYPE_CODE } from "@/constants/constants";


function ietmPVPAdapter(pvp: ItemPVPApi): ItemPVP {
    return ({
        feeId: pvp.idTarifa,
        salePrice: pvp.precioVenta,
        priceWithVat: pvp.precioConIva,
        description: pvp.tarifa,
        default: pvp.precioPredeterminado
    })
}

function itemFrom(items: ItemApiResponse[]): Array<Item> {
    return items.map((item) => {
        return {
            id: item.id,
            itemId: item.itemTypeCode === ITEM_TYPE_CODE.ITEM ? item.id : 0, //idItem
            menuId: item.itemTypeCode === ITEM_TYPE_CODE.MENU ? item.id : 0, //MenuId para combos 
            summary: item.summary,
            productId: item.productId,
            descripcion: item.descripcion,
            s3ObjectUrl: item.s3ObjectUrl,
            stock: item.stock,
            codigo: item.codigo,
            medida: item.medida,
            tipoIva: item.tipoIva,
            costPrice: item.costPrice,
            pvp: ietmPVPAdapter(JSON.parse(item.pvp)),
            totalRecords: item.totalRecords,
            itemTypeCode: item.itemTypeCode,
            idMedida: item.idMedida,
        }
    })
}

export const itemAdapter = {
    itemFrom
}