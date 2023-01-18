import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getIsBookable, getIsYourRoom } from "../features/roomSlice";
import { toggleModal } from "../features/modalSlice";

// Components
import CalendarElement from "./Calendar/CalendarElement";
import HourPicker from "./Calendar/Hourpicker";
import DatePicker from "./Calendar/DatePicker";
import Button from "./Ui/Button";

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

  const dispatch = useDispatch()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fromToHours, setFromToHours] = useState<FromToHour>({ from: "09", to: "18" })
  const [openCalendar, setOpenCalendar] = useState(false)

  const roomIsBookable = useSelector(getIsBookable)
  const isYourRoom = useSelector(getIsYourRoom)

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
      <div className="date-tool__container">
        <div className="date-tool__book-all">
          {roomIsBookable &&
              // id="meetAll"
              <Button
                  type="button"
                  icon=""
                  text={`${isYourRoom ? 'Cancella prenotazione' : 'Prenota stanza'}`}
                  className={`cta cta--primary ${isYourRoom ? "your" : "available"}`}
                  onClick={
                      () => {
                          setSeatName("meet-room");
                          dispatch(toggleModal(true));
                          if (roomIsBookable) {
                              setAction('ADD');
                          }
                          if (isYourRoom) {
                              setAction('DELETE');
                          }
                      }
                  }
              />
          }
        </div>
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