import { produce } from "immer"
import { create, StateCreator } from "zustand"

import { DataFormPos, dataFormPosInitialState, DataPopulatedFloorRoomTable } from "./types"

interface SharedSlice {
    error: string | null
    loading: boolean
    dataFormPos: DataFormPos
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setDataFormPos(data: DataFormPos): void
    setDataPopulatedFloorRoomTable(data: DataPopulatedFloorRoomTable): void
}

const createSharedSlice: StateCreator<
    SharedSlice,
    [],
    [],
    SharedSlice
> = (set) => ({
    error: null,
    loading: false,
    dataFormPos: dataFormPosInitialState,
    setLoading: (loading) => { 
        set(produce((state: SharedSlice) => {
            state.loading = loading;
        }))
    },
    setError(error) {
        set(state => {
            state.error = error;
            return state;
        })
    },
    setDataFormPos(dataFormPos) {
        set(state => {
            state.dataFormPos = dataFormPos;
            return state;
        })
    },
    setDataPopulatedFloorRoomTable(data) {
        set(produce((state: SharedSlice) => {
            state.dataFormPos.dataPopulatedFloorRoomTable = data;
        }))
    }
})


export const useSharedStore = create<SharedSlice>()((...a) => ({
    ...createSharedSlice(...a),
}))