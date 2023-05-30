import { useEffect, useRef } from 'react'

// Components
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { FromToHour } from '../../types';

interface CalendarProps {
    selectedDate: Date,
    setSelectedDate: (data: Date) => void,
    handleConfirmDate: (data: Date) => void,
    setOpenCalendar: (isOpen: boolean) => void,
    openCalendar: boolean,
    setFromToHours: ({ from, to }:FromToHour) => void
}

const CalendarElement: React.FC<CalendarProps> = (props): JSX.Element => {

    const { selectedDate, setSelectedDate, handleConfirmDate, setOpenCalendar, openCalendar, setFromToHours } = props
    const ref = useRef<any>(null)

    useEffect(() => {
        const currentDate: any = document.querySelector(".calendar-tool__current-date"),
            daysTag: any = document.querySelector(".days"),
            prevNextIcon: any = document.querySelectorAll(".calendar-tool__icons svg")

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
                let liClass = (
                    i === date.getDate()
                    && currMonth === new Date().getMonth()
                    && currYear === new Date().getFullYear()
                    && (selectedDate.getFullYear() < 2000))
                    ||
                    (i === selectedDate.getDate()
                        && currMonth === selectedDate.getMonth()
                        && currYear === selectedDate.getFullYear())
                    ? "active"
                    : (new Date(currYear, currMonth, i + 1) < new Date())
                        ? "inactive"
                        : "day";
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
                    setOpenCalendar(false)
                    setFromToHours({ from: "09", to: "10" })
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
    }, [selectedDate, handleConfirmDate, setOpenCalendar, setSelectedDate, setFromToHours])

    // UseRef per controllare se il click è interno
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpenCalendar(false)
            }
        };
        window.addEventListener('click', handleClickOutside, true);
        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };
    }, [setOpenCalendar]);

    return (
        <div className={`calendar-tool${openCalendar ? ' is-open' : ''}`} ref={ref}>
            <header className='calendar-tool__header'>
                <h4 className="calendar-tool__current-date">Novemeber 2022</h4>
                <div className="calendar-tool__icons">
                    <GrFormPrevious id="prev" size={24} />
                    <GrFormNext id="next" size={24} />
                </div>
            </header>
            <div className="calendar calendar-tool__day-container">
                <ul className="calendar-tool__weeks">
                    <li>Sun</li>
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                </ul>
                <ul className="days calendar-tool__days"></ul>
            </div>
        </div>
    )
}

export default CalendarElement