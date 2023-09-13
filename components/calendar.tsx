import { useState, useEffect } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getReserves } from "../features/reserveSlice";
import { setIsYourRoom } from "../features/roomSlice";

// Hooks
import { useAuthHook } from "../hooks/useAuthHook";

// Components
import HourPicker from "./Calendar/Hourpicker";
import DatePicker from "./Calendar/DatePicker";

// Type
import { FromToHour, Reserve } from "../types";
import { transformDate } from "../utils/datePharser";
import { getEndHour, getStartHour } from "../features/timePickerSlice";
import { DEFAULT_END_HOUR, DEFAULT_START_HOUR } from "../_shared";

interface CalendarProps {
	setFromTo: (data: { from: string; to: string }) => void;
}

const Calendar: React.FC<CalendarProps> = (props): JSX.Element => {
	const { setFromTo } = props;
	const dispatch = useDispatch();
	const { userData } = useAuthHook();
	const reserveData: Reserve[] = useSelector(getReserves);
	const username: string = userData.name;
	const startHour = useSelector(getStartHour);
	const endHour = useSelector(getEndHour);

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [fromToHours, setFromToHours] = useState<FromToHour>({
		from: DEFAULT_START_HOUR,
		to: DEFAULT_END_HOUR,
	});
	const [openCalendar, setOpenCalendar] = useState<boolean>(false);

	const handleOpenCalendar = (): void => {
		setOpenCalendar(true);
	};

	// const handleChangeHour = async (
	// 	startHour: string,
	// 	endHour: string
	// ): Promise<void> => {
	// 	const fromDate: string = transformDate(startHour, selectedDate);
	// 	const toDate: string = transformDate(endHour, selectedDate);
	// 	setFromToHours({ from: startHour, to: endHour });
	// 	setFromTo({ from: fromDate, to: toDate });
	// };
	// console.log("FR", fromToHours);

	const handleConfirmDate = async (selDate: Date): Promise<void> => {
		const fromDate: string = transformDate(startHour, selDate);
		const toDate: string = transformDate(startHour, selDate);
		setFromTo({ from: fromDate, to: toDate });
	};

	useEffect(() => {
		const fromDate: string = transformDate(startHour, selectedDate);
		const toDate: string = transformDate(endHour, selectedDate);
		setFromTo({ from: fromDate, to: toDate });
	}, [selectedDate, startHour, endHour, setFromTo]);

	useEffect(() => {
		const wholeRoom: Reserve | undefined = reserveData.find(
			(r: Reserve) => r?.seat?.type === "whole"
		);
		if (wholeRoom) {
			const isYour: boolean = reserveData.some(
				(r: Reserve) => r.user.username === username
			);
			dispatch(setIsYourRoom(isYour));
		} else {
			dispatch(setIsYourRoom(false));
		}
	}, [reserveData, dispatch, username]);

	return (
		<>
			<div className="date-tool__container">
				<div className="date-tool__settings">
					<DatePicker
						date={selectedDate}
						handleOpenCalendar={handleOpenCalendar}
						openCalendar={openCalendar}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						handleConfirmDate={handleConfirmDate}
						setOpenCalendar={setOpenCalendar}
						setFromToHours={setFromToHours}
					/>
					<HourPicker
						// handleChangeHour={handleChangeHour}
						selectedDate={selectedDate}
					/>
				</div>
			</div>
		</>
	);
};

export default Calendar;
