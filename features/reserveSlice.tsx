import { createSlice } from '@reduxjs/toolkit'
import { FromToHour, Reserve } from '../types'

interface InitialStateTypes {
    reserveData: Reserve[] | [],
    dayReserveData: [] | FromToHour[],
    username: string
}

interface ReservesState {
    reserves: {
        reserveData: Reserve[] | [],
        dayReserveData: Reserve[] | [],
    },
}

const initialState: InitialStateTypes = {
    reserveData: [],
    dayReserveData: [],
    username: ""
}

const reserveSlice = createSlice({
    name: 'reserves',
    initialState,
    reducers: {
        setReserves: (state, action) => {
            state.reserveData = action.payload.reserveData
        },
        setDayReserves: (state, action) => {
            state.dayReserveData = action.payload.dayReserveData
        }
    }
})


export default reserveSlice.reducer
export const { setReserves, setDayReserves } = reserveSlice.actions
export const getReserves = (state: ReservesState) => state.reserves.reserveData
export const getDayReserves = (state: ReservesState) => state.reserves.dayReserveData