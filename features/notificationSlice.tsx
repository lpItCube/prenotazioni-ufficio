import { createSlice } from '@reduxjs/toolkit'

interface InitialState {
    pending: string
}

const initialState: InitialState = {
    pending:'',
}

interface NotificationState {
    notification: {
        pending: string
    }
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
export const getPendingNotification = (state:NotificationState) => state.notification.pending