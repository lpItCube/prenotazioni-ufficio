import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

// Components
import CalendarElement from "./Calendar/CalendarElement";
import HourPicker from "./Calendar/Hourpicker";
import DatePicker from "./Calendar/DatePicker";

type FromToHour = {
  from: string,
  to: string
}

function Calendar({ setFromTo, setReserveData }: any) {

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
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </Head>
      {/* <Test/> */}
      <div className="date-tool__container">
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
        {/* {openCalendar &&

          <CalendarElement
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleConfirmDate={handleConfirmDate}
            handleOpenCalendar={handleOpenCalendar}
          />
        } */}
      </div>
    </>
  )
}

export default Calendar