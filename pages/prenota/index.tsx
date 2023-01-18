import axios from "axios"
import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Router from "next/router"
import { useEffect, useState } from "react"
import Calendar from "../../components/calendar"
import FirstOffice from "../../components/first-office"
import prisma from "../../lib/prisma"

// Redux
import { useSelector } from 'react-redux'
import { getIsBookable, getIsYourRoom } from "../../features/roomSlice"

type DateRange = {
  from: string | null,
  to: string | null
}

function createNewDate(hour: string) {
  const currYear = new Date().getFullYear()
  const currMonth = ("0" + (new Date().getMonth() + 1)).slice(-2)
  const day = ("0" + new Date().getDate()).slice(-2)
  const textDate = currYear + "-" + currMonth + "-" + day + "T" + hour + ":00:00";
  return textDate
}

function Prenota({ initialData }: any) {
  console.log('INITIAL DATA',initialData)
  const { status, data } = useSession()
  const [ date, setDate ] = useState("2022-12-15")
  const [ reserveData, setReserveData ] = useState(initialData)
  const [ fromTo, setFromTo ] = useState<DateRange>({from: null, to: null}) 

  const [seatName, setSeatName] = useState("none")
  console.log('IS YOUR ROOM AND IS BOOKABLE?',useSelector(getIsYourRoom), useSelector(getIsBookable))
  const [action, setAction] = useState("")

  const session = useSession()

  useEffect(() => {
    const fromDate = createNewDate("08")
    const toDate = createNewDate("18")
    setFromTo({ from: fromDate, to: toDate })
  }, [])

  useEffect(() => {
    console.log("rerender")
  }, [reserveData])

  useEffect(() => {
    //if (status === "unauthenticated" ) Router.replace("/login")
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }, [status])

  useEffect(() => {
    console.log("rerender from date")
  }, [fromTo])
  
  if(status === "authenticated")
    return (
      <>
        <Calendar 
          setFromTo={setFromTo} 
          setReserveData={setReserveData} 
          setSeatName={setSeatName}
          setAction={setAction}
        />
        <FirstOffice 
          reserveData={reserveData} 
          setReserveData={setReserveData} 
          fromTo={fromTo} 
          seatName={seatName}
          setSeatName={setSeatName}
          action={action}
          setAction={setAction}
        />
      </>

    )
  else return <div>Loading</div>
}

export default Prenota

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  const fromDate = createNewDate("08")
  const toDate = createNewDate("18")
  const initialData = await prisma.reserve.findMany({
    include: {
      seat: true,
      user: true
    }
  })
  const filteredReserveDate = initialData.filter(r => !(r.from > new Date(toDate as string) || r.to < new Date(fromDate as string)))  

  return {
    props: { initialData: JSON.parse(JSON.stringify(filteredReserveDate)), session }
  }
}