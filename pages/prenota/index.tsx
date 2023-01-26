import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import prisma from "../../lib/prisma"
import axios from "axios"

import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

// Components
import Calendar from "../../components/calendar"
import FirstOffice from "../../components/first-office"
import Spinner from "../../components/Ui/Spinner"

// Redux
import { useSelector } from 'react-redux'
import { getIsBookable, getIsYourRoom } from "../../features/roomSlice"
// import { getUserRole } from "../../features/authSlice"

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

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

  const session = useSession()
  const { status, data } = useSession()

  const [ reserveData, setReserveData ] = useState(initialData)
  const [ fromTo, setFromTo ] = useState<DateRange>({from: null, to: null}) 
  const [seatName, setSeatName] = useState("none")
  const [action, setAction] = useState("")

  const { userData } = useAuthHook()
  const userRole = userData.role

  useEffect(() => {
    const fromDate = createNewDate("09")
    const toDate = createNewDate("10")
    setFromTo({ from: fromDate, to: toDate })
  }, [])


  useEffect(() => {
    const reloadDataSession = async () => {
      if(fromTo.from && fromTo.to) {
        const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
        setReserveData(reloadData)
      }
    }

    reloadDataSession()
  }, [session, fromTo])


  useEffect(() => {
    //if (status === "unauthenticated" ) Router.replace("/login")
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }, [status])


  
  if(status === "authenticated")
    return (
      <>
        <Calendar 
          reserveData={reserveData}
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
  else return <div><Spinner/></div>
}

export default Prenota

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const session = await getSession({ req: context.req });

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false
  //     }
  //   }
  // }
  const fromDate = createNewDate("09")
  const toDate = createNewDate("10")
  const initialData = await prisma.reserve.findMany({
    include: {
      seat: true,
      user: true
    }
  })
  const filteredReserveDate = initialData.filter(r => !(r.from > new Date(toDate as string) || r.to < new Date(fromDate as string)))  

  return {
    props: { initialData: JSON.parse(JSON.stringify(filteredReserveDate)) }
    
  }
}