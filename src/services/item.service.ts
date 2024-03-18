
import { http } from '@/utils/http';
import { PATHS, PATHS_API } from '@/constants/constants'; 
import { Item } from '@/models/item.model';
import { itemAdapter } from '@/adapters/item.adapter'; 

const getItems = async <T>(obj: T, signal?: AbortSignal) => {
    const json = JSON.stringify(obj)
    const responseApi = await http({
        method: 'get',
        url: `${PATHS_API.PRIVATE}${PATHS.ITEM}`,
        params: {
            json
        },
        signal: signal
    })

    const response = responseApi.data;
    let items: Array<Item> = [];
    if (response) {
        items = itemAdapter.itemFrom(response.items);
    }
    return items;
}


export const itemSvc = {
    getItems, 
}
