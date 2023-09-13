import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_END_HOUR, DEFAULT_START_HOUR } from "../_shared";

interface InitialStateTypes {
	startHour: string;
	endHour: string;
}

const initialState: InitialStateTypes = {
	startHour: DEFAULT_START_HOUR,
	endHour: DEFAULT_END_HOUR,
};

interface TimePickerState {
	timePicker: {
		startHour: string;
		endHour: string;
	};
}

const timePickerSlice = createSlice({
	name: "timePicker",
	initialState,
	reducers: {
		setStartHour: (state, action) => {
			state.startHour = action.payload;
		},
		setEndHour: (state, action) => {
			state.endHour = action.payload;
		},
	},
});

export default timePickerSlice.reducer;
export const { setStartHour, setEndHour } = timePickerSlice.actions;
export const getStartHour = (state: TimePickerState) =>
	state.timePicker.startHour;
export const getEndHour = (state: TimePickerState) => state.timePicker.endHour;
