import axios from "axios";
import { useState } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux"
import { getReserves, setReserves } from "../features/reserveSlice"

// Hooks
import { useAuthHook } from "../hooks/useAuthHook";

// Components
import HourPicker from "./Calendar/Hourpicker";
import DatePicker from "./Calendar/DatePicker";
import BookAll from "./Rooms/BookAll";
import { getActualRoom } from "../features/roomSlice";

type FromToHour = {
  from: string,
  to: string
}

function Calendar({ 
  setFromTo, 
  setSeatName,
  setAction
}: any) {


  const dispatch = useDispatch()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fromToHours, setFromToHours] = useState<FromToHour>({ from: "09", to: "10" })
  const [openCalendar, setOpenCalendar] = useState(false)
  const { userData } = useAuthHook()
  const reserveData = useSelector(getReserves)
  const roomId = useSelector(getActualRoom)
  const userRole = userData.role

  const handleOpenCalendar = () => {
    setOpenCalendar(true)
  }

  function createNewDate(selectedDate: Date, hour: string) {
    const currYear = selectedDate.getFullYear()
    const currMonth = ("0" + (selectedDate.getMonth() + 1)).slice(-2)
    const day = ("0" + selectedDate.getDate()).slice(-2)
    const textDate = currYear + "-" + currMonth + "-" + day + "T" + hour + ":00:00";
    return textDate
  }

  const handleChangeHour = async (startHour: any, endHour: any) => {

    const fromDate = createNewDate(selectedDate, startHour)
    const toDate = createNewDate(selectedDate, endHour)
    // const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data
    const res = await (await axios.get(`/api/roomReserves/${roomId}`)).data
      const filteredRes = res.filter((r: any) => 
        !(new Date(r.from) > new Date(fromDate as string) || new Date(r.to) < new Date(toDate as string)
      ))
    setFromToHours({ from: startHour, to: endHour })
    setFromTo({ from: fromDate, to: toDate })
    dispatch(setReserves({reserveData:filteredRes}))
  }

  const handleConfirmDate = async (selDate: Date) => {
    const fromDate = createNewDate(selDate, fromToHours.from)
    const toDate = createNewDate(selDate, fromToHours.to)
    const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data
    setFromTo({ from: fromDate, to: toDate })
    dispatch(setReserves({reserveData:res}))
  }

  // const userRole = useSelector(getUserRole)
  const needApproval = reserveData.filter((res:any) => res.seat.type === 'meet-whole' && res.status === 'pending').length > 0 && userRole === 'ADMIN'
  const notBookAll = userRole === 'USER' && reserveData.length > 0

  return (
    <>
    {/* {notBookAll && <p>Non puoi prenotare tutto</p>} */}
      <div className="date-tool__container">

        <BookAll
          needApproval={needApproval}
          notBookAll={notBookAll}
          containerClass={'date-tool__book-all'}
          setSeatName={setSeatName}
          setAction={setAction}
        />
        <div className="date-tool__settings">
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