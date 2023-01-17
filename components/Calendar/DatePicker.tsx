// Components 
import { IoCalendarOutline } from "react-icons/io5"
import { Colors } from "../Ui/Colors"
import CalendarElement from "./CalendarElement"

type DatePickerProps = {
    date: Date,
    handleOpenCalendar: any,
    openCalendar:any,
    selectedDate:any,
    setSelectedDate:any,
    handleConfirmDate:any,
    setOpenCalendar:any
}

function DatePicker({
    date,
    handleOpenCalendar,
    openCalendar,
    selectedDate,
    setSelectedDate,
    handleConfirmDate,
    setOpenCalendar
}: DatePickerProps) {
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
                    >{("0" + date.getDate()).slice(-2)}</p>
                    <p
                        className="datepicker__number"
                    >{("0" + (date.getMonth() + 1)).slice(-2)}</p>
                    <p
                        className="datepicker__number"
                    >{date.getFullYear()}</p>
                </div>
                <IoCalendarOutline
                    size={18}
                    color={Colors.dark700}
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