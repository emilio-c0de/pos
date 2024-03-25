import { OrderItem } from "@/models/order.model"
import { produce } from "immer"
import { create, StateCreator } from "zustand"

import { DIVIDE_STATUS_REFRESH, OrderDataStore, orderDataStoreInitial, OrderItemDivide } from "./divide.type"

interface DivideState<T, U> {
    REFRESH_CONTENT_DIVIDE?: DIVIDE_STATUS_REFRESH.REFRESH_CONTENT_DIVIDE | null
    REFRESH_ORDER_LIST?: DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST | null
    error: string | null
    loading: boolean,
    tempOrderData: T
    orderData: T,
    orderDivideItems: U[]
    cloneOrderDivideItems: U[]
}

interface DivideActions<T, U> {
    initLoadOrderData(orderData: T): void
    setOrderDivideItem(orderData: U[]): void
    setRefreshContentDivide(data: DIVIDE_STATUS_REFRESH.REFRESH_CONTENT_DIVIDE): void,
    setRefreshOrderList(data: DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST): void
    resetState(): void
}

type DivideStateCreator = DivideState<OrderDataStore, OrderItemDivide> & DivideActions<OrderDataStore, OrderItemDivide>
const createDivideSlice: StateCreator<
    DivideStateCreator,
    [],
    [],
    DivideStateCreator
> = (set) => ({
    REFRESH_CONTENT_DIVIDE: null,
    REFRESH_ORDER_LIST: null,
    error: null,
    loading: false,
    tempOrderData: structuredClone(orderDataStoreInitial),
    orderData: structuredClone(orderDataStoreInitial),
    orderDivideItems: [],
    cloneOrderDivideItems: [],
    initLoadOrderData(orderData) {
        set(
            produce((state: DivideStateCreator) => {
                const orderDivideItems = orderData.order.items.map(item => ({
                    ...item,
                    remainingQuantityReal: item.remainingQuantity || 0
                }))
                state.orderData = structuredClone(orderData);
                state.tempOrderData = structuredClone(orderData);
                state.orderDivideItems = orderDivideItems;
                state.cloneOrderDivideItems = structuredClone(orderDivideItems);
            })
        )
    },
    setOrderDivideItem(items) {
        set(
            produce((state: DivideStateCreator) => {
                state.orderDivideItems = items;
            })
        )
    },
    setRefreshContentDivide(data) {
        set(
            produce((state: DivideStateCreator) => {
                state.REFRESH_CONTENT_DIVIDE = data;
            })
        )
    },
    setRefreshOrderList(data) {
        set(
            produce((state: DivideStateCreator) => {
                state.REFRESH_ORDER_LIST = data;
            })
        )
    },
    resetState() {
        set({
            REFRESH_CONTENT_DIVIDE: null,
            REFRESH_ORDER_LIST: null,
            error: null,
            loading: false,
            tempOrderData: structuredClone(orderDataStoreInitial),
            orderData: structuredClone(orderDataStoreInitial),
            orderDivideItems: [],
            cloneOrderDivideItems: [],
        })
    }
})


export const useDivideStore = create<DivideStateCreator>()((...a) => ({
    ...createDivideSlice(...a),
}))