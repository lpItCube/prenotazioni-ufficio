import axios from "axios";
import Head from "next/head";
import { useState } from "react";

// Components
import HourPicker from "./Calendar/Hourpicker";
import DatePicker from "./Calendar/DatePicker";
import BookAll from "./Rooms/BookAll";

type FromToHour = {
  from: string,
  to: string
}

function Calendar({ 
  setFromTo, 
  setReserveData,
  setSeatName,
  setAction
}: any) {


  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fromToHours, setFromToHours] = useState<FromToHour>({ from: "09", to: "18" })
  const [openCalendar, setOpenCalendar] = useState(false)

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

  async function handleChangeHour(startHour: any, endHour: any) {

    

    const fromDate = createNewDate(selectedDate, startHour)
    const toDate = createNewDate(selectedDate, endHour)
    const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data

    setFromToHours({ from: startHour, to: endHour })
    setFromTo({ from: fromDate, to: toDate })

    // console.log('CLICK',fromDate,toDate)
    setReserveData(res)
  }

  async function handleConfirmDate(selDate: Date) {

    const fromDate = createNewDate(selDate, fromToHours.from)
    const toDate = createNewDate(selDate, fromToHours.to)

    const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data

    setFromTo({ from: fromDate, to: toDate })
    setReserveData(res)
  }


  return (
    <>
      <div className="date-tool__container">
        <BookAll
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