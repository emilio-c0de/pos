
import { Item } from "@/models/item.model"
import { itemSvc } from "@/services/item.service"
import { CATEGORY_CODE } from "@/constants/constants"
import { produce } from "immer"
import { StateCreator, create } from "zustand"

interface GetItemsProps {
    tipo: number
    idSubFamilia: number
    pageIndex: number,
    pageSize: number
}


const dataSearchInitial: GetItemsProps = {
    tipo: 2,
    idSubFamilia: 0,
    pageIndex: 1,
    pageSize: 25,
}

interface ItemSlice {
    loading: boolean
    error?: string | null
    items: Item[]
    tempItems: Item[]
    item: Item | null
    dataSearch: GetItemsProps
}


interface Actions {
    fetchItems(): void
    setDataSearch<T extends keyof typeof dataSearchInitial>(dataSearch: {
        prop: T,
        value: typeof dataSearchInitial[T],
        codigo?: string
    }): void
    setLoading(loading: boolean): void
    setError(error?: string | null): void
    setItems(items: Array<Item>): void
    setItem(item: Item): void
    filterItems(textSearch: string): void

}

const initialState: ItemSlice = {
    loading: false,
    error: '',
    items: [],
    tempItems: [],
    item: null,
    dataSearch: dataSearchInitial,
};
let controller: AbortController;

const createItemSlice: StateCreator<ItemSlice & Actions, [], [], ItemSlice & Actions> = (set, get) => ({
    ...initialState,
    fetchItems: async () => {
        const { dataSearch } = get();
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        const signal = controller.signal;

        set({ loading: true, error: '' });
        itemSvc.getItems(dataSearch, signal).then(response => {
            set({
                items: response,
                tempItems: structuredClone(response)
            });
        })
            .catch(error => {

                set({ error: error.message })

            })
            .finally(() => set({ loading: false }),)
    },
    setDataSearch({ prop, value, codigo }) {
        set(
            produce((state: ItemSlice) => {
                if (prop === 'idSubFamilia') {
                    state.dataSearch.pageIndex = 1;
                }
                if (codigo === CATEGORY_CODE.COM) {
                    state.dataSearch.tipo = 3;
                } else {
                    state.dataSearch.tipo = 2
                }
                const dataSearch = {
                    ...state.dataSearch,
                    [prop]: value,
                }
                state.dataSearch = dataSearch;
            })
        )
    },
    setLoading: (loading) => set(produce((state: ItemSlice) => {
        state.loading = loading
    })),
    setError: (error) => set(produce((state: ItemSlice) => {
        state.error = error
    })),
    setItems: (items) => set(produce((state: ItemSlice) => {
        state.items = items
    })),
    setItem: (item) => set(produce((state: ItemSlice) => {
        state.item = item
    })),
    filterItems(textSearch) {
        const { tempItems } = get();
        if (!textSearch) {
            set(produce((state: ItemSlice) => {
                state.items = tempItems
            }))
            return
        }

        const filteredItems = tempItems.filter((item) => {
            return (
                item.codigo.toLowerCase().includes(textSearch.toLowerCase()) ||
                item.descripcion.toLowerCase().includes(textSearch.toLowerCase())
            );
        });
        set(produce((state: ItemSlice) => {
            state.items = filteredItems
        }))

    },
})



export const useItemStore = create<ItemSlice & Actions>()((...a) => ({
    ...createItemSlice(...a),
}));


