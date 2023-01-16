import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from '../features/navigationSlice'
import modalReducer from '../features/modalSlice'

export const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        modal: modalReducer
    }
})

// export type store = ReturnType<typeof store.getState>
// export default store
export type RootState = ReturnType<typeof store.getState>