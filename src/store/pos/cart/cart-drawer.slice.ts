import { Order, OrderItem } from "@/models/order.model";
import { produce } from "immer"
import { create, StateCreator } from "zustand"

import { getOrderInitialState, orderItemInitialState } from "./cart.types";

interface CartDrawerSlice<T, U> {
    isOpenCartDrawer: boolean
    order: T
    orderItem: U
    setOpenCartDrawer(data: { isOpenCartDrawer: boolean, orderItem?: U }): void
    updateOrderItem(orderItem: U): void
}

type ImplementState = CartDrawerSlice<Order, OrderItem>;

const createSharedSlice: StateCreator<
    ImplementState,
    [],
    [],
    ImplementState
> = (set) => ({
    isOpenCartDrawer: false,
    order: getOrderInitialState(),
    orderItem: orderItemInitialState,
    setOpenCartDrawer(data) {
        const { isOpenCartDrawer, orderItem } = data;

        set(produce((state: ImplementState) => {
            state.isOpenCartDrawer = isOpenCartDrawer;

            if (!isOpenCartDrawer) {
                state.orderItem = orderItemInitialState
            }
            if (orderItem) {
                state.orderItem = orderItem
            }
        }))
    },
    updateOrderItem(orderItem) {
        set(produce((state: ImplementState) => {
            state.orderItem = orderItem;
        }))

    }
})


export const useCartDrawerStore = create<ImplementState>()((...a) => ({
    ...createSharedSlice(...a),
}))