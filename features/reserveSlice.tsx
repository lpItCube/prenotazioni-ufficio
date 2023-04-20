import { createSlice } from '@reduxjs/toolkit'
import { FromToHour, Reserve } from '../types'

interface InitialStateTypes {
    reserveData: Reserve[] | [],
    dayReserveData: [] | FromToHour[],
    userOnSeat: string
}

interface ReservesState {
    reserves: {
        reserveData: Reserve[] | [],
        dayReserveData: Reserve[] | [],
        userOnSeat: string
    },
}

const initialState: InitialStateTypes = {
    reserveData: [],
    dayReserveData: [],
    userOnSeat: ""
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
        },
        setUserOnSeat: (state, action) => {
            state.userOnSeat = action.payload.userOnSeat
        }
    }
})


export default reserveSlice.reducer
export const { setReserves, setDayReserves, setUserOnSeat } = reserveSlice.actions
export const getReserves = (state: ReservesState) => state.reserves.reserveData
export const getDayReserves = (state: ReservesState) => state.reserves.dayReserveData
export const getUserOnSeat = (state: ReservesState) => state.reserves.userOnSeat