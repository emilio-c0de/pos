import { GroupedEstab, GroupedEstabPuntoEmision } from "@/models/estab.model"
import { OrderRead } from "@/models/order.model"
import { TableOrderFilter } from "@/models/table.model"
import { UserSelectHtmlOnly } from "@/models/user.model"
import { orderSvc } from "@/services/order.service"
import { getDataEstab } from "@/services/persist-user.service"
import { hideLoader, showLoader } from "@/utils/loader"
import { isValidField } from "@/utils/utils"
import { produce } from "immer"
import { create, StateCreator } from "zustand"

import { initialOrderDataFilter, OrderDataFilter } from "./order.type"

interface OrderState<T> {
    error: string | null
    loading: boolean,
    dataFilter: OrderDataFilter
    orders: T[]
    establecimientos: Array<GroupedEstab>
    puntosEmision: Array<GroupedEstabPuntoEmision>
    tables: Array<TableOrderFilter>
    users: Array<UserSelectHtmlOnly>
}

interface OrderActions {
    getDataFilter(): void
    getOrders(): void
    setChangeFieldFilter<T extends keyof typeof initialOrderDataFilter>(
        prop: T,
        value: typeof initialOrderDataFilter[T]
    ): void
    onChangeDateRange<T extends { from: string, to: string }>(data: T): void
}

type OrderStateCreator = OrderState<OrderRead> & OrderActions
const createDivideSlice: StateCreator<
    OrderStateCreator,
    [],
    [],
    OrderStateCreator
> = (set, get) => ({
    error: null,
    loading: false,
    dataFilter: initialOrderDataFilter,
    orders: [],
    establecimientos: [],
    puntosEmision: [],
    tables: [],
    users: [],
    getDataFilter() {
        try {
            const codEstab = getDataEstab().codEstab;
            showLoader();
            orderSvc.getDataFilter({}).then(response => {
                const { tables, users, establecimientos } = response;
                const tempEstabs = establecimientos.filter(e => e.codEstab === codEstab);
                const dataEstab = establecimientos.find(e => e.codEstab === codEstab);

                set(
                    produce((state: OrderStateCreator) => {
                        state.tables = tables;
                        state.users = users;
                        state.establecimientos = tempEstabs;
                        if (dataEstab) {
                            state.puntosEmision = dataEstab.puntosEmision;
                            state.dataFilter.codEstab = dataEstab.codEstab;
                            const dataPuntoEmision = dataEstab.puntosEmision.find(p => p.defaultPtoEmi);
                            if (dataPuntoEmision) {
                                state.dataFilter.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
                            }
                        }
                    })
                )
            }).catch((error) => console.log(error))
                .finally(() => hideLoader())
        } catch (error) {
            hideLoader()
            console.log(error)

        }
    },
    getOrders() {
        const { dataFilter } = get();
        try {
            showLoader();
            const params = {
                pageIndex: dataFilter.pageIndex,
                pageSize: dataFilter.pageSize,
                startDate: dataFilter.fromDate,
                endDate: dataFilter.toDate,
                customerCompanyId: isValidField(dataFilter.customerCompanyId),
                tableId: isValidField(dataFilter.tableId),
                userId: isValidField(dataFilter.userId),
                puntoEmisionId: isValidField(dataFilter.idPuntoEmision),
                finished: dataFilter.tipoOrden === 'CD'
            }
            orderSvc.getAll(params).then(response => {
                if (response) {
                    set(
                        produce((state: OrderStateCreator) => {
                            state.orders = response;
                        })
                    )
                }
            }).catch((error) => console.log(error))
                .finally(() => hideLoader())
        } catch (error) {
            hideLoader()
        }
    },
    setChangeFieldFilter(prop, value) {
        set(
            produce((state: OrderStateCreator) => {
                state.dataFilter[prop] = value;
            })
        )
    },
    onChangeDateRange({ from, to }) { 
        set(
            produce((state: OrderStateCreator) => {
                state.dataFilter["fromDate"] = from;
                state.dataFilter["toDate"] = to;
            })
        )
    }
})


export const useOrderStore = create<OrderStateCreator>()((...a) => ({
    ...createDivideSlice(...a),
}))