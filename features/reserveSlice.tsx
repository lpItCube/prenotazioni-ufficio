import { createSlice } from '@reduxjs/toolkit'
import { FromToHour, Reserve } from '../types'

interface InitialStateTypes {
    reserveData: Reserve[] | [],
    dayReserveData: [] | Reserve[],
    dayAllReserveData:[] | Reserve[],
    userOnSeat: any
}

interface ReservesState {
    reserves: {
        reserveData: Reserve[] | [],
        dayReserveData: Reserve[] | [],
        dayAllReserveData: Reserve[] | [],
        userOnSeat: any
    },
}

const initialState: InitialStateTypes = {
    reserveData: [],
    dayReserveData: [],
    dayAllReserveData: [],
    userOnSeat: []
}

const reserveSlice = createSlice({
    name: 'reserves',
    initialState,
    reducers: {
        setReserves: (state, action) => {
            state.reserveData = action.payload.reserveData
        },
        setDayReserves: (state, action) => {
            state.dayReserveData = action.payload.dayReserveData,
            state.dayAllReserveData = action.payload.dayAllReserveData
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
export const getDayAllReserves = (state: ReservesState) => state.reserves.dayAllReserveData
export const getUserOnSeat = (state: ReservesState) => state.reserves.userOnSeat