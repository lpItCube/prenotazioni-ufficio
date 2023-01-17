import { useState, useEffect } from 'react'
import axios from 'axios'
// Components
import Calendar from "../calendar"

type FromToHour = {
  from: string,
  to: string
}

type CalendarBarProps = {
  setFromTo:any,
  setReserveData:any
}

function CalendarBar({
  setFromTo,
  setReserveData
}: CalendarBarProps ) {

  const [fromToHours, setFromToHours] = useState<FromToHour>({ from: "09", to: "18" })
  const [selectedDate, setSelectedDate] = useState(new Date())


  const createNewDate = (selectedDate: Date, hour: string) => {
    const currYear = selectedDate.getFullYear()
    const currMonth = ("0" + (selectedDate.getMonth() + 1)).slice(-2)
    const day = ("0" + selectedDate.getDate()).slice(-2)
    const textDate = currYear + "-" + currMonth + "-" + day + "T" + hour + ":00:00";
    return textDate
  }

  const handleChangeHour = async () => {
    // const target = e.target as HTMLElement
    // console.log(target.nodeValue)
    const fromValue = (document.getElementById("from") as HTMLInputElement).value
    const toValue = (document.getElementById("to") as HTMLInputElement).value
    setFromToHours({ from: fromValue, to: toValue })
  
    const fromDate = createNewDate(selectedDate, fromValue)
    const toDate = createNewDate(selectedDate, toValue)
  
    const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data
  
    setFromTo({ from: fromDate, to: toDate })
    setReserveData(res)
  }


  const handleConfirmDate = async (selDate: Date) =>{

    const fromDate = createNewDate(selDate, fromToHours.from)
    const toDate = createNewDate(selDate, fromToHours.to)

    const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data

    setFromTo({ from: fromDate, to: toDate })
    setReserveData(res)
  }

  useEffect(() => {
    const currentDate: any = document.querySelector(".current-date"),
      daysTag: any = document.querySelector(".days"),
      prevNextIcon: any = document.querySelectorAll(".icons span")

    let date = selectedDate,
      currYear = date.getFullYear(),
      currMonth = date.getMonth()

    const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]

    const renderCalendar = () => {
      let firstDateOfMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(),
        liTag = ""

      for (let i = firstDateOfMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`
      }

      for (let i = 1; i <= lastDateOfMonth; i++) {
        let liClass = (i === date.getDate() && currMonth === new Date().getMonth()
          && currYear === new Date().getFullYear() && (selectedDate.getFullYear() < 2000)) ||
          (i === selectedDate.getDate() && currMonth === selectedDate.getMonth() && currYear === selectedDate.getFullYear()) ? "active"
          : (new Date(currYear, currMonth, i + 1) < new Date()) ? "inactive" : "";
        liTag += `<li class="${liClass}">${i}</li>`
      }

      for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
      }

      currentDate.innerText = `${months[currMonth]} ${currYear}`
      daysTag.innerHTML = liTag;

      const daysEl: any = document.querySelectorAll(".days li:not(.inactive)")
      daysEl.forEach((liDay: any) => {
        liDay.addEventListener("click", (e: Event) => {
          var currentEl = e.target as HTMLElement
          const selDay = parseInt(currentEl.textContent as string)
          const selDate = new Date(currYear, currMonth, selDay)
          // setSelectedDay(selDay)
          setSelectedDate(selDate)
          handleConfirmDate(selDate)
        })
      });
    }
    renderCalendar()

    prevNextIcon.forEach((icon: any) => {
      icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1

        if (currMonth < 0 || currMonth > 11) {
          date = new Date(currYear, currMonth)
          currYear = date.getFullYear()
          currMonth = date.getMonth()
        } else {
          date = new Date()
        }
        renderCalendar()
      })
    })

  }, [selectedDate])

  return (
    <div
      className='calendar-bar__container'
    >
      <Calendar
        handleChangeHour={handleChangeHour}
      />
      CalendarBar
    </div>
  )
}

export default CalendarBar