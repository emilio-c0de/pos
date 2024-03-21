import { Order } from "@/models/order.model";

export const enum DIVIDE_STATUS_REFRESH {
    REFRESH_CONTENT_DIVIDE = "REFRESH_CONTENT_DIVIDE",
    REFRESH_ORDER_LIST = "REFRESH_ORDER_LIST"
}

export interface OrderDataStore {
    order: Order
}

export const orderDataStoreInitial: OrderDataStore = {
    order: {
        uuid: "",
        orderId: 0,
        userId: 0,
        customerCompanyId: 0,
        customerName: "",
        createdAt: new Date(),
        items: [],
        tableId: 0,
        establecimientoId: 0,
        puntoEmisionId: 0,
        tax: 0,
        discount: 0,
        tip: 0,
        total: 0,
        subtotalSinImpuestos: 0
    }
}