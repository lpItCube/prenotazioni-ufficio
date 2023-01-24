import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    pending:'',
}

const notificationSlice = createSlice({
    name:'notification',
    initialState,
    reducers: {
        setPendingNotification: (state, action) => {
            state.pending = action.payload.pending
        },
    }
})

export default notificationSlice.reducer
export const { setPendingNotification } = notificationSlice.actions
export const getPendingNotification = (state:any) => state.notification.pending