import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    reserveData:[]
}

const reserveSlice = createSlice({
    name:'reserves',
    initialState,
    reducers: {
        setReserves: (state, action) => {
            state.reserveData = action.payload.reserveData
        },
    }
})

export default reserveSlice.reducer
export const { setReserves } = reserveSlice.actions
export const getReserves = (state:any) => state.reserves.reserveData