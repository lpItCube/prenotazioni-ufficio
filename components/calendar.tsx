import Head from "next/head";
import { useEffect, useState } from "react";

function Calendar() {

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(0)

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
          setSelectedDay(selDay)
          setSelectedDate(selDate)
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
        <h2>Selezione un giorno disponibile per eseguire una prenotazione per quella data</h2>
        <div className="separator"> </div>
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
      <a href={`/prenota/${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()}`} className="calendar-button">Prosegui</a>
    </div>
    </>
  )
}

export default Calendar
