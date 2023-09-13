import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	getEndHour,
	getStartHour,
	setEndHour,
	setStartHour,
} from "../../features/timePickerSlice";

// Components
import Select from "../Ui/Select";
import Option from "../Ui/Option";

// Types
import { Calendar } from "../../types";
import { createEndTime, createStartTime } from "../../utils/hourFunctions";
import { DEFAULT_END_HOUR, DEFAULT_START_HOUR } from "../../_shared";

interface HourpickerProps {
	// handleChangeHour: (start: string, end: string) => void;
	selectedDate: Date;
}

const Hourpicker: React.FC<HourpickerProps> = (props): JSX.Element => {
	const { selectedDate } = props;

	const startTime: Calendar[] = [];
	const endTime: Calendar[] = [];

	const startRef = useRef<any>(null);
	const endRef = useRef<any>(null);
	const dispatch = useDispatch();
	const startHour = useSelector(getStartHour);
	const endHour = useSelector(getEndHour);

	const [stHour, setStHour] = useState<any>("");
	const [enHour, setEnHour] = useState<any>("");
	const [startOpen, setStartOpen] = useState<boolean>(false);
	const [endOpen, setEndOpen] = useState<boolean>(false);

	useEffect(() => {
		setStHour(createStartTime(9, 18, "start"));
		setEnHour(createEndTime(10, 19, "end"));
	}, [selectedDate]);

	useEffect(() => {
		const startNumber = parseInt(startHour);
		const endNumber = parseInt(endHour);
		setEnHour(createEndTime(startNumber + 1, 19, "end"));

		if (endNumber <= startNumber) {
			dispatch(setEndHour((startNumber + 1).toString()));
		}
	}, [startHour, endHour, dispatch]);

	useEffect(() => {
		dispatch(setStartHour(DEFAULT_START_HOUR));
		dispatch(setEndHour(DEFAULT_END_HOUR));
	}, [selectedDate, dispatch]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (startRef.current && !startRef.current.contains(event.target)) {
				setStartOpen(false);
			}
			if (endRef.current && !endRef.current.contains(event.target)) {
				setEndOpen(false);
			}
		};
		window.addEventListener("click", handleClickOutside, true);
		return () => {
			window.removeEventListener("click", handleClickOutside, true);
		};
	}, []);

	const handleOpenStartOption = () => {
		setStartOpen((prev) => !prev);
	};

	const handleOpenEndOption = () => {
		setEndOpen((prev) => !prev);
	};

	const handleStartHour = (hourValue: string) => {
		dispatch(setStartHour(hourValue));
	};

	const handleEndHour = (hourValue: string | number) => {
		dispatch(setEndHour(hourValue));
	};

	return (
		<>
			<div ref={startRef} className="select__ref">
				<Select
					label="From"
					value={`${startHour.padStart(2, "0")}:00`}
					onClick={() => handleOpenStartOption}
					openOption={startOpen}
				>
					{stHour.length > 0 &&
						stHour.map((hour: any, index: number) => {
							return (
								<Option
									key={index}
									onClick={() => handleStartHour(hour.value)}
									label={hour.time}
									className={
										`${String(startHour).padStart(
											2,
											"0"
										)}:00` === hour.time
											? " current"
											: ""
									}
								/>
							);
						})}
				</Select>
			</div>
			<div ref={endRef} className="select__ref">
				<Select
					label="to"
					value={`${endHour.padStart(2, "0")}:00`}
					onClick={() => handleOpenEndOption}
					openOption={endOpen}
				>
					{enHour.length > 0 &&
						enHour.map((hour: any, index: number) => {
							return (
								<Option
									key={index}
									onClick={() => handleEndHour(hour.value)}
									label={hour.time}
									className={
										`${String(endHour).padStart(
											2,
											"0"
										)}:00` === hour.time
											? " current"
											: ""
									}
								/>
							);
						})}
				</Select>
			</div>
		</>
	);
};

export default Hourpicker;
