import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from '../features/navigationSlice'
import modalReducer from '../features/modalSlice'
import roomReducer from '../features/roomSlice'
import authReducer from '../features/authSlice'
import notificationReducer from '../features/notificationSlice'

export const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        modal: modalReducer,
        room: roomReducer,
        auth: authReducer,
        notification: notificationReducer
    }
})

// export type store = ReturnType<typeof store.getState>
// export default store
export type RootState = ReturnType<typeof store.getState>