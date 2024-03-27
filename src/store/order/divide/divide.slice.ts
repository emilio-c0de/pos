import { orderSvc } from "@/services/order.service"
import { hideLoader, showLoader } from "@/utils/loader"
import { produce } from "immer"
import { create, StateCreator } from "zustand"

import { DIVIDE_STATUS_REFRESH, OrderDataStore, orderDataStoreInitial, OrderItemDivide } from "./divide.type"

interface DivideState<T, U> {
    REFRESH_ORDER_LIST?: DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST | null
    error: string | null
    loading: boolean,
    tempOrderData: T
    orderData: T,
    orderDivideItems: U[]
    cloneOrderDivideItems: U[],
    selected: readonly number[]
}

interface DivideActions<T, U> {
    getDataOrderById(id: number): void
    initLoadOrderData(orderData: T): void
    setOrderDivideItem(orderData: U[]): void
    setRefreshOrderList(data: DIVIDE_STATUS_REFRESH.REFRESH_ORDER_LIST): void
    resetState(): void
    setSelected(newValue: readonly number[]): void
    handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>): void
}

type DivideStateCreator = DivideState<OrderDataStore, OrderItemDivide> & DivideActions<OrderDataStore, OrderItemDivide>
const createDivideSlice: StateCreator<
    DivideStateCreator,
    [],
    [],
    DivideStateCreator
> = (set, get) => ({
    REFRESH_ORDER_LIST: null,
    error: null,
    loading: false,
    tempOrderData: structuredClone(orderDataStoreInitial),
    orderData: structuredClone(orderDataStoreInitial),
    orderDivideItems: [],
    cloneOrderDivideItems: [],
    selected: [],
    getDataOrderById(id) {
        const { initLoadOrderData } = get();
        try {
            showLoader();
            orderSvc.getId(id).then(response => {
                initLoadOrderData(response)
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    },
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
    setRefreshOrderList(data) {
        const { orderData, getDataOrderById } = get();
        set(
            produce((state: DivideStateCreator) => {
                state.REFRESH_ORDER_LIST = data;
                state.selected = [];
            })
        )
        getDataOrderById(orderData.order.orderId)
    },

    setSelected(newValue) {
        set({
            selected: newValue
        })
    },
    handleSelectAllClick(event) {
        const { orderDivideItems } = get();
        if (event.target.checked) {
            const newSelected = orderDivideItems.filter(item => (item.remainingQuantity || 0) > 0 && !(item.paid)).map((n) => n.id);
            set(
                produce((state: DivideStateCreator) => {
                    state.selected = newSelected;
                })
            )
            return;
        }
        set(
            produce((state: DivideStateCreator) => {
                state.selected = [];
                state.orderDivideItems = state.cloneOrderDivideItems;
            })
        )
    },
    resetState() {
        set({
            REFRESH_ORDER_LIST: null,
            error: null,
            loading: false,
            tempOrderData: structuredClone(orderDataStoreInitial),
            orderData: structuredClone(orderDataStoreInitial),
            orderDivideItems: [],
            cloneOrderDivideItems: [],
            selected: []
        })
    },
})


export const useDivideStore = create<DivideStateCreator>()((...a) => ({
    ...createDivideSlice(...a),
}))