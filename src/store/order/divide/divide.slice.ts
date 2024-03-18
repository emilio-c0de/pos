import { produce } from "immer"
import { create, StateCreator } from "zustand"

import { OrderDataStore, orderDataStoreInitial } from "./divide.type"

interface DivideState<T> {
    error: string | null
    loading: boolean,
    tempOrderData: T
    orderData: T
}

interface DivideActions<T> {
    setOrderData(orderData: T): void
}

type DivideStateCreator = DivideState<OrderDataStore> & DivideActions<OrderDataStore>
const createDivideSlice: StateCreator<
    DivideStateCreator,
    [],
    [],
    DivideStateCreator
> = (set) => ({
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

    }
})


export const useDivideStore = create<DivideStateCreator>()((...a) => ({
    ...createDivideSlice(...a),
}))