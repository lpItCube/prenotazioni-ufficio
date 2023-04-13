import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    reserveData:[],
    dayReserveData:[],
    username: ""
}

const reserveSlice = createSlice({
    name:'reserves',
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
export const getReserves = (state:any) => state.reserves.reserveData
export const getDayReserves = (state:any) => state.reserves.dayReserveData