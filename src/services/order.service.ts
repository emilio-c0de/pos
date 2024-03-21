import { orderDocAdapter } from "@/adapters/order-doc.adapter";
import { orderAdapter } from "@/adapters/order.adapter";
import { PATHS, PATHS_API } from "@/constants/constants"
import { ApiResponse } from "@/models/api-response";
import { OrderDocRaw } from "@/models/order-doc.model";
import { OrderRead } from "@/models/order.model";
import { TableOrderFilter } from "@/models/table.model";
import { UserSelectHtmlOnly } from "@/models/user.model";
import { groupEstabUtil } from "@/utils/group-estab.util";
import { http } from "@/utils/http"

class OrderService {
    private url = `${PATHS_API.PRIVATE}${PATHS.ORDER}`;

    async getDataFilter<T>(obj: T) {
        const json = JSON.stringify({
            ...obj,
            tipo: 4
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
        })
        const response = resultAxios.data;
        const tables: Array<TableOrderFilter> = response.tables;
        const users: Array<UserSelectHtmlOnly> = response.usuarios;
        const establecimientos = groupEstabUtil({
            puntosEmisionEstab: response.establecimientos,
            isGroupPuntoEmision: true
        })
        return {
            tables,
            users,
            establecimientos
        }
    }

    async post<T>(data: T) {
        const resultAxios = await http({
            method: 'post',
            url: `${this.url}`,
            data: { data }
        })

        const response: ApiResponse = resultAxios.data;
        return response;
    }

    async getId(id: number) {
        const json = JSON.stringify({
            id,
            tipo: 2
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
        })
        const response = resultAxios.data;

        const params = {
            order: response.order[0],
            orderItems: response.orderItems
        }
        return orderAdapter.getIdFrom(params)
    }
    async put<T>(id: number, data: T) {
        console.log(`${this.url}${id}`)
        const resultAxios = await http({
            method: 'put',
            url: `${this.url}${id}`,
            data: { data }
        })

        const response: ApiResponse = resultAxios.data;
        return response;
    }

    async getAll<T>(obj: T) {
        const json = JSON.stringify({
            ...obj,
            tipo: 1
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
        })
        const response = resultAxios.data;
        let orders: Array<OrderRead> = []

        if (response !== null && typeof response === 'object') {
            orders = orderAdapter.getAllFrom(response.orders);
        }
        return orders;
    }

    async getOrderDocs(id: number) {
        const json = JSON.stringify({
            id,
            tipo: 3
        })
        const resultAxios = await http({
            method: 'get',
            url: `${this.url}?json=${json}`,
        })
        const response = resultAxios.data;
        let orderDocs: Array<OrderDocRaw> = []

        if (response !== null && typeof response === 'object') {
            orderDocs = orderDocAdapter.getAllFrom(response.orderDocuments);

        }
        return orderDocs;
    }
}

export const orderSvc = new OrderService()