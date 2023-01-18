import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from '../features/navigationSlice'
import modalReducer from '../features/modalSlice'
import roomReducer from '../features/roomSlice'

export const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        modal: modalReducer,
        room: roomReducer
    }
})

// export type store = ReturnType<typeof store.getState>
// export default store
export type RootState = ReturnType<typeof store.getState>