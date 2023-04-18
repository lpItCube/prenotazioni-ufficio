// Utils
import { getStringDate } from "../../utils/datePharser"

// Icon
import { IoCalendarOutline } from "react-icons/io5"

// Components 
import { Colors } from "../Ui/Colors"
import CalendarElement from "./CalendarElement"

interface DatePickerProps {
    date: Date,
    handleOpenCalendar: () => void,
    openCalendar: boolean,
    selectedDate: Date,
    setSelectedDate: (data:Date) => void,
    handleConfirmDate: (data:Date) => void,
    setOpenCalendar: (isOpen:boolean) => void,
}

const DatePicker: React.FC<DatePickerProps> = (props): JSX.Element => {

    const { date, handleOpenCalendar, openCalendar, selectedDate, setSelectedDate, handleConfirmDate, setOpenCalendar } = props

    return (
        <div
            onClick={() => handleOpenCalendar()}
            className="datepicker__container"
        >
            <p className="label">
                Data
            </p>
            <div className="datepicker__wrapper">
                <div className="datepicker__date">
                    <p
                        className="datepicker__number"
                    >{getStringDate(date.toString()).day}</p>
                    <p
                        className="datepicker__number"
                    >{getStringDate(date.toString()).month}</p>
                    <p
                        className="datepicker__number"
                    >{getStringDate(date.toString()).year}</p>
                </div>
                <IoCalendarOutline
                    size={18}
                    color={Colors.dark700}
                    fill={openCalendar ? Colors.green500 : Colors.dark700}
                    stroke={openCalendar ? Colors.green500 : Colors.dark700}
                />
            </div>
            <CalendarElement
                openCalendar={openCalendar}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleConfirmDate={handleConfirmDate}
                setOpenCalendar={setOpenCalendar}
            />
        </div>
    )
}

export default DatePicker