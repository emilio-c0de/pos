import { OrderUpdateDto } from "@/models/order.model";

export interface OrderDataStore {
    order: OrderUpdateDto
}

export const orderDataStoreInitial: OrderDataStore = {
    order: {
        serie: "",
        divided: false,
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
        total: 0
    }
}