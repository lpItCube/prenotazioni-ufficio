import axios from "axios";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";

type FromToHour = {
  from: string,
  to: string
}

function Calendar({setFromTo, setReserveData}: any) {

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fromToHours, setFromToHours] = useState<FromToHour>({from: "09", to: "18"}) 
  const [selectedDay, setSelectedDay] = useState(0)


  function createNewDate(selectedDate: Date, hour: string) {
    const currYear = selectedDate.getFullYear()
    const currMonth = selectedDate.getMonth() + 1
    const day = selectedDate.getDate()
    const textDate = currYear + "-" + currMonth + "-" + day + "T" + hour + ":00:00";
    return textDate
  }  

  async function handleChangeHour(e: ChangeEvent) {
    const target = e.target as HTMLElement
    console.log(target.nodeValue)
    const fromValue = (document.getElementById("from") as HTMLInputElement).value
    const toValue = (document.getElementById("to") as HTMLInputElement).value
    setFromToHours({from: fromValue, to: toValue})

    const fromDate = createNewDate(selectedDate, fromValue)
    const toDate = createNewDate(selectedDate, toValue)
    
    const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data

    setFromTo({from: fromDate, to: toDate})
    setReserveData(res)
  }

  async function handleConfirmDate(selDate: Date) {

    const fromDate = createNewDate(selDate, fromToHours.from)
    const toDate = createNewDate(selDate, fromToHours.to)

    const res = await (await axios.get(`/api/reserve?from=${fromDate}&to=${toDate}`)).data

    setFromTo({from: fromDate, to: toDate})
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
                      : (new Date(currYear, currMonth, i + 1) < new Date()) ? "inactive": "";
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

        if(currMonth < 0 || currMonth > 11) {
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
    <>
    <Head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    </Head>
    <div className="calendar-container">
      <div className="content-test-info">
        <h2 className="calendar-info">Selezione un giorno disponibile per eseguire una prenotazione per quella data</h2>
        <div className="separatorCalendar"> </div>
      </div>
      <div className="wrapper">
        <header>
          <p className="current-date">Novemeber 2022</p>
          <div className="icons">
            <span id="prev" className="material-symbols-rounded">chevron_left</span>
            <span id="next" className="material-symbols-rounded">chevron_right</span>
          </div>
        </header>
        <div className="calendar">
          <ul className="weeks">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul className="days"></ul>
        </div>
      </div>
      <div>
        {/* Seleziona orario: 
        <input type="number" min="0" max="8" placeholder="0" onChange={(e) => {handleChangeHour(e)}}></input> */}

        <form>
          <label htmlFor="from">From: </label>
            <select name="from" id="from" onChange={(e) => {handleChangeHour(e)}}>
              <option value="00">00:00</option>
              <option value="01">01:00</option>
              <option value="02">02:00</option>
              <option value="03">03:00</option>
              <option value="04">04:00</option>
              <option value="05">05:00</option>
              <option value="06">06:00</option>
              <option value="07">07:00</option>
              <option value="08">08:00</option>
              <option value="09">09:00</option>
              <option value="10">10:00</option>
              <option value="11">11:00</option>
              <option value="12">12:00</option>
              <option value="13">13:00</option>
              <option value="14">14:00</option>
              <option value="15">15:00</option>
              <option value="16">16:00</option>
              <option value="17">17:00</option>
              <option value="18">18:00</option>
              <option value="19">19:00</option>
              <option value="20">20:00</option>
              <option value="21">21:00</option>
              <option value="22">22:00</option>
              <option value="23">23:00</option>
            </select>

            <label htmlFor="to">To: </label>
            <select name="to" id="to" onChange={(e) => {handleChangeHour(e)}}>
              <option value="00">00:00</option>
              <option value="01">01:00</option>
              <option value="02">02:00</option>
              <option value="03">03:00</option>
              <option value="04">04:00</option>
              <option value="05">05:00</option>
              <option value="06">06:00</option>
              <option value="07">07:00</option>
              <option value="08">08:00</option>
              <option value="09">09:00</option>
              <option value="10">10:00</option>
              <option value="11">11:00</option>
              <option value="12">12:00</option>
              <option value="13">13:00</option>
              <option value="14">14:00</option>
              <option value="15">15:00</option>
              <option value="16">16:00</option>
              <option value="17">17:00</option>
              <option value="18">18:00</option>
              <option value="19">19:00</option>
              <option value="20">20:00</option>
              <option value="21">21:00</option>
              <option value="22">22:00</option>
              <option value="23">23:00</option>
            </select>
        </form>
      </div>
      {/* <a href={`/prenota/${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()}`} className="calendar-button">Prosegui</a> */}
      {/* <button className="calendar-button" onClick={() => handleConfirmDate()}> Conferma </button> */}
    </div>
    </>
  )
}

export default Calendar