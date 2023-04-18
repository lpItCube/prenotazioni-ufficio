import { useState, useEffect } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux"
import { getReserves } from "../features/reserveSlice"
import { setIsYourRoom } from "../features/roomSlice";

// Hooks
import { useAuthHook } from "../hooks/useAuthHook";

// Components
import HourPicker from "./Calendar/Hourpicker";
import DatePicker from "./Calendar/DatePicker";

// Type
import { FromToHour, Reserve } from "../types";
import { createNewDate } from "../utils/datePharser";

interface CalendarProps {
  setFromTo: (data:{from: string, to: string}) => void
}

const Calendar:React.FC<CalendarProps> = (props) : JSX.Element => {

  const { setFromTo } = props
  const dispatch = useDispatch()
  const { userData } = useAuthHook()
  const reserveData: Reserve[] = useSelector(getReserves)
  const username: string = userData.name

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [fromToHours, setFromToHours] = useState<FromToHour>({ from: "09", to: "10" })
  const [openCalendar, setOpenCalendar] = useState<boolean>(false)

  const handleOpenCalendar = (): void => {
    setOpenCalendar(true)
  }

  const handleChangeHour = async (startHour: string, endHour: string): Promise<void> => {
    const fromDate: string = createNewDate(startHour, selectedDate)
    const toDate: string = createNewDate(endHour, selectedDate)
    setFromToHours({ from: startHour, to: endHour })
    setFromTo({ from: fromDate, to: toDate })
  }
  
  const handleConfirmDate = async (selDate: Date): Promise<void> => {
    const fromDate: string = createNewDate(fromToHours.from as string, selDate)
    const toDate: string = createNewDate(fromToHours.to as string, selDate)
    setFromTo({ from: fromDate, to: toDate })
  }

  useEffect(() => {
		const wholeRoom: Reserve | undefined = reserveData.find((r: Reserve) => r?.seat?.type === "whole")
		if(wholeRoom) {
			const isYour: boolean = reserveData.some((r: Reserve) => r.user.username === username)
      dispatch(setIsYourRoom(isYour))
		} else {
      dispatch(setIsYourRoom(false))
    }
	}, [reserveData])


  return (
    <>
      <div className="date-tool__container">
        <div className="date-tool__settings">
          { /* DEBUG INSIDE 0 */}
          <DatePicker
            date={selectedDate}
            handleOpenCalendar={handleOpenCalendar}
            openCalendar={openCalendar}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleConfirmDate={handleConfirmDate}
            setOpenCalendar={setOpenCalendar}
          />
          <HourPicker
            handleChangeHour={handleChangeHour}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </>
  )
}

export default Calendar