import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    roomIsBookable: false,
    isYourRoom: false,
    actualRoom:''
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
        },
        setActualRoom: (state, action) => {
            state.actualRoom = action.payload
        }
    }
})

export default roomSlice.reducer
export const { setBookable, setIsYourRoom, setActualRoom } = roomSlice.actions
export const getIsBookable = (state:any) => state.room.roomIsBookable 
export const getIsYourRoom = (state:any) => state.room.isYourRoom 
export const getActualRoom = (state:any) => state.room.actualRoom