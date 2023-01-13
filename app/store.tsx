import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from '../features/navigationSlice'

export const store = configureStore({
    reducer: {
        navigation: navigationReducer
    }
})

// export type store = ReturnType<typeof store.getState>
// export default store
export type RootState = ReturnType<typeof store.getState>