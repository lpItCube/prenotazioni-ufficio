import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import prisma from '../../lib/prisma';

function BookSeat() {
  const [days, setDays]: any = useState([])
  const [selectedDay, setSelectedDay]: any = useState()
  const [selectedDays, setSelectedDays]: any = useState([])

  useEffect(() => {
    setDays(getDaysInMonth())
  }, [])

  useEffect(() => {
    if(selectedDay != null)
      setSelectedDays([...selectedDays, selectedDay])
  }, [selectedDay])

  function selectDay(e: Event) {
    const el = e.target as HTMLElement
    setSelectedDay(el.id)
    el.classList.toggle("selected")
  }

  function tdNumbers(clickable: boolean) {
    var tdToAdd: any = []
    var className = clickable ? "td-days active-cell" : "td-days"

    days.forEach((el: Date) => {
      var key = clickable ? `day: ${el}` : `active-day: ${el}`
      const td = clickable ? 
        <td key={key} id={key} className={className} onClick={(e: any) => selectDay(e)}></td>
        :  <td key={key} id={key} className={className}>{el.getDate()}</td>
      tdToAdd.push(td)
    })
    return tdToAdd;
  }

  function tdWeeks() {
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var tdToAdd: any = []

    days.forEach((el: Date) => {
      const wday = weekday[el.getDay()]
      tdToAdd.push(
        <td className="td-week" key={"week: " + el.getDate()}>{wday}</td>
      )
    })
    return tdToAdd;
  }

  return (
    <div className="bookContainer">
      <table className="table">
        <thead>
          <tr> { tdWeeks() } </tr>
          <tr> { tdNumbers(false) } </tr>
        </thead>
        <tbody>
          <tr> { tdNumbers(true) } </tr>
        </tbody>
      </table>
      <button className='confirm-btn'>Conferma selezionati</button>
    </div>
  )
}

function getDaysInMonth() {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default BookSeat

export const getStaticProps: GetStaticProps = async (context: any) => {
  const seatId = context.params.seatId
  const seat = await prisma.seat.findUnique({
    where: {
      name: seatId
    }
  })
  return {
    props: { seat },
    revalidate: 10
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const seats = await prisma.seat.findMany()
  const arr: any = []

  const paths = seats.forEach((seat) => {
    const path = {
      params: { id: seat.name }
    }
    arr.push(path)
  })
  return {
    paths: [],
    fallback: "blocking"
  }
}