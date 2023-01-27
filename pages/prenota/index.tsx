import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import prisma from "../../lib/prisma"
import axios from "axios"

// Redux
import { useDispatch } from "react-redux"
import { setReserves } from "../../features/reserveSlice"

// Components
import Calendar from "../../components/calendar"
import FirstOffice from "../../components/first-office"
import Spinner from "../../components/Ui/Spinner"


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

  const dispatch = useDispatch()
  const session = useSession()
  const { status } = useSession()

  const [ fromTo, setFromTo ] = useState<DateRange>({from: null, to: null}) 
  const [seatName, setSeatName] = useState("none")
  const [action, setAction] = useState("")


  useEffect(() => {
    const fromDate = createNewDate("09")
    const toDate = createNewDate("10")
    setFromTo({ from: fromDate, to: toDate })
    dispatch(setReserves({reserveData:initialData}))
  }, [])


  useEffect(() => {
    const reloadDataSession = async () => {
      if(fromTo.from && fromTo.to) {
        const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
        dispatch(setReserves({reserveData:reloadData}))
      }
    }

    reloadDataSession()
  }, [session, fromTo])


  useEffect(() => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }, [status])


  
  if(status === "authenticated")
    return (
      <>
        <Calendar 
          setFromTo={setFromTo} 
          setSeatName={setSeatName}
          setAction={setAction}
        />
        <FirstOffice 
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