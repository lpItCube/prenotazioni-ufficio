import { createSlice } from '@reduxjs/toolkit'

interface InitialStateTypes {
    startHour: number,
    endHour: number
}

const initialState: InitialStateTypes = {
    startHour: 9,
    endHour:10
}

interface TimePickerState {
    timePicker: {
        startHour: number,
        endHour: number
    }
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
export const getStartHour = (state:TimePickerState) => state.timePicker.startHour 
export const getEndHour = (state:TimePickerState) => state.timePicker.endHour