import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from '../features/navigationSlice'
import modalReducer from '../features/modalSlice'
import roomReducer from '../features/roomSlice'
import authReducer from '../features/authSlice'
import notificationReducer from '../features/notificationSlice'
import reserveReducer from '../features/reserveSlice'
import timePickerReducer from '../features/timePickerSlice'

export const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        modal: modalReducer,
        room: roomReducer,
        auth: authReducer,
        notification: notificationReducer,
        reserves:reserveReducer,
        timePicker:timePickerReducer
    }
})

// export type store = ReturnType<typeof store.getState>
// export default store
export type RootState = ReturnType<typeof store.getState>