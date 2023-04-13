import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    startHour: 9,
    endHour:10
}

const timePickerSlice = createSlice({
    name:'timePicker',
    initialState,
    reducers: {
        setStartHour: (state, action) => {
            state.startHour = action.payload
        },
        setEndHour: (state, action) => {
            state.endHour = action.payload
        }
    }
})

export default timePickerSlice.reducer
export const { setStartHour, setEndHour } = timePickerSlice.actions
export const getStartHour = (state:any) => state.timePicker.startHour 
export const getEndHour = (state:any) => state.timePicker.endHour