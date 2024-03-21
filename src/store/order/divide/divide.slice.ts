import { produce } from "immer"
import { create, StateCreator } from "zustand"

import { DIVIDE_STATUS_REFRESH, OrderDataStore, orderDataStoreInitial } from "./divide.type"

interface DivideState<T> {
    REFRESH_CONTENT_DIVIDE?: DIVIDE_STATUS_REFRESH.REFRESH_CONTENT_DIVIDE | null
    REFRESH_ORDER_LIST?: DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST | null
    error: string | null
    loading: boolean,
    tempOrderData: T
    orderData: T
}

interface DivideActions<T> {
    setOrderData(orderData: T): void
    setRefreshContentDivide(data: DIVIDE_STATUS_REFRESH.REFRESH_CONTENT_DIVIDE): void,
    setRefreshOrderList(data: DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST): void
    resetState(): void
}

type DivideStateCreator = DivideState<OrderDataStore> & DivideActions<OrderDataStore>
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
    setOrderData(orderData) {
        set(
            produce((state: DivideStateCreator) => {
                state.orderData = orderData;
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
        })
    }
})


export const useDivideStore = create<DivideStateCreator>()((...a) => ({
    ...createDivideSlice(...a),
}))