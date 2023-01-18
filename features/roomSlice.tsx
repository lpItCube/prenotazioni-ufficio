import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    roomIsBookable: false,
    isYourRoom: false
}

const roomSlice = createSlice({
    name:'room',
    initialState,
    reducers: {
        setBookable: (state, action) => {
            state.roomIsBookable = action.payload
        },
        setIsYourRoom: (state, action) => {
            state.isYourRoom = action.payload
        }
    }
})

export default roomSlice.reducer
export const { setBookable, setIsYourRoom } = roomSlice.actions
export const getIsBookable = (state:any) => state.room.roomIsBookable 
export const getIsYourRoom = (state:any) => state.room.isYourRoom 