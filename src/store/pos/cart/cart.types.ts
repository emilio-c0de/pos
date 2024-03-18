import { Order, OrderItem } from "@/models/order.model.ts";
import { generateUuidv4 } from "@/utils/generate-uuidv4";

export const getOrderInitialState = (): Order => {
    return {
        uuid: generateUuidv4(),
        createdAt: new Date(),
        items: [],
        customerCompanyId: 0,
        customerName: '',
        userId: 0,
        obs: null,
        tableId: 0,
        tableName: '',
        establecimientoId: 0, 
        orderId: 0,
        puntoEmisionId: 0,
        tax: 0,
        discount: 0,
        tip: 0,
        total: 0,
        quickSale: false,
        bodegaId: 0
    }
}
export const orderItemInitialState: OrderItem = {
    uuid: "",
    itemTypeCode: "",
    id: 0,
    menuId: 0,
    itemId: 0,
    taxId: 0,
    taxPercentId: 0,
    feeId: 0,
    taxValue: 0,
    quantity: 0,
    cost: 0,
    price: 0,
    discount: 0,
    total: 0,
    bodegaId: 0,
    medidaId: 0,
    productId: 0,
    code: "",
    precioConIVA: 0,
    precioTotalSinImpuesto: 0,
    medida: "",
    descripcion: "",
    llevaInventario: false,
    medidas: [],
    pvps: [],
    consolidacionesFecha: [],
    taxPercent: 0,
    codigoTarifaImpuesto: ""
}