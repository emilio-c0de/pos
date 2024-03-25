import { Order, OrderItem } from "@/models/order.model";
import { generateUuidv4 } from "@/utils/generate-uuidv4";
import { addSound, clearSound } from "@/utils/sound.util";
import { produce } from "immer";
import { create, StateCreator } from "zustand"

import { getOrderInitialState, orderItemInitialState } from "./cart.types";
import { getCalculateTotalDetalle } from "./cart.utils";

interface CartState {
    isOpenCartDrawer: boolean
    order: Order
    orderItem: OrderItem
    stringTaxexTotals: string
}
interface Actions<T> {
    addToCartItem(orderItem: T): void
    updateCartItem(orderItem: T): void
    deleteCartItem(orderItem: T): void
    setChangeValueCart<U extends keyof T>(data: { property: U, orderItem: T }): void
    setUpdateOrderData(order: Partial<Order>): void
    setUpdateOrderItemCartDrawer(orderItem: T): void
    resetForm(): void
}



const initialState: CartState = {
    isOpenCartDrawer: false,
    order: getOrderInitialState(),
    orderItem: orderItemInitialState,
    stringTaxexTotals: ''
};


const createCartSlice: StateCreator<
    CartState & Actions<OrderItem>,

    [],
    [],
    CartState & Actions<OrderItem>
> = (set, get) => ({
    ...initialState,
    addToCartItem(orderItem) {
        set(produce((state: CartState) => {
            state.order.items.push(orderItem)
            addSound();
        }))
    },
    updateCartItem: (orderItem) => {
        const { order } = get();

        const updatedItems = order.items.map(item => {
            if (item.uuid === orderItem.uuid) {
                const updatedItem = {
                    ...item,
                    quantity: orderItem.quantity,
                    consolidacionesFecha: orderItem.consolidacionesFecha,
                };
                const dataTotal = getCalculateTotalDetalle(updatedItem);
                updatedItem.taxValue = dataTotal.valorImpuesto;
                updatedItem.total = dataTotal.total;
                addSound();
                return updatedItem;
            }
            return item;
        });
        set(produce((state: CartState) => {
            state.order.items = updatedItems;
        }))
    },
    deleteCartItem(orderItem) {
        const { order } = get();
        const indexToDelete = order.items.findIndex(item => item.uuid === orderItem.uuid);
        const filteredItems = order.items.filter((_, index) => index !== indexToDelete);
        set(produce((state: CartState) => {
            state.order.items = filteredItems;
        }))
        clearSound();
    },
    setChangeValueCart(data) {
        const { order } = get();
        const { property, orderItem } = data;

        const updatedItems = order.items.map(item => {
            if (item.uuid === orderItem.uuid) {
                const updatedItem = {
                    ...item,
                    [property]: orderItem[property],
                };
                const dataTotal = getCalculateTotalDetalle(updatedItem);
                updatedItem.taxValue = dataTotal.valorImpuesto;
                updatedItem.total = dataTotal.total;
                addSound();
                return updatedItem;
            }
            return item;
        })

        set(produce((state: CartState) => {
            state.order.items = updatedItems;
        }))
    },
    setUpdateOrderData: (order) => {

        if (order) {
            set(produce((state: CartState) => {
                state.order = {
                    ...get().order,
                    ...order,
                };
            }))
        }
    },
    setUpdateOrderItemCartDrawer(orderItem) {
        const { order } = get();

        const updatedItems = order.items.map((item) => {
            if (item.uuid === orderItem.uuid) {
                const dataTotal = getCalculateTotalDetalle(orderItem);
                return {
                    ...item,
                    ...orderItem,
                    total: dataTotal.total,
                    taxValue: dataTotal.valorImpuesto
                };
            }
            return item;
        });

        set(produce((state: CartState) => {
            state.orderItem = orderItem
            state.order.items = updatedItems;
        }))
    },
    resetForm() {
        set(produce((state: CartState) => {
            state.order.uuid = generateUuidv4()
            state.order.tableId = 0;
            state.order.tableName = "";
            state.order.obs = "";
            state.order.customerName = "";
            state.order.customerCompanyId = 0;
            state.order.orderId = 0;
            state.order.items = [];
        }))
    },
})


export const useCartStore = create<CartState & Actions<OrderItem>>()((...a) => ({
    ...createCartSlice(...a),
}))