import { createSlice } from '@reduxjs/toolkit'

interface InitialStateTypes {
    roomIsBookable: boolean,
    isYourRoom: boolean,
    actualRoom: string,
    actualRoomName: string
}

interface RoomState {
    room: {
        roomIsBookable: boolean,
        isYourRoom: boolean,
        actualRoom: string,
        actualRoomName: string
    }
}

const initialState: InitialStateTypes = {
    roomIsBookable: false,
    isYourRoom: false,
    actualRoom:'',
    actualRoomName:''
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
        },
        setActualRoomName: (state, action) => {
            state.actualRoomName = action.payload
        }
    }
})

export default roomSlice.reducer
export const { setBookable, setIsYourRoom, setActualRoom, setActualRoomName } = roomSlice.actions
export const getIsBookable = (state:RoomState) => state.room.roomIsBookable 
export const getIsYourRoom = (state:RoomState) => state.room.isYourRoom 
export const getActualRoom = (state:RoomState) => state.room.actualRoom
export const getActualRoomName = (state:RoomState) => state.room.actualRoomName