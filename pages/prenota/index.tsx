import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getToken } from "next-auth/jwt";
import prisma from "../../lib/prisma"
import axios from "axios"
import { getSession } from 'next-auth/react';

// Redux
import { useDispatch } from "react-redux"
import { setReserves } from "../../features/reserveSlice"

// Components
import Calendar from "../../components/calendar"
// import FirstOffice from "../../components/first-office"
import Spinner from "../../components/Ui/Spinner"
import { NextRequest } from "next/server";
import HandleOffice from "../../components/handleOffice";


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

function Prenota({ initialData, domain, domainList }: any) {

	const dispatch = useDispatch()
	const session = useSession()
	const { status } = useSession()

	const [fromTo, setFromTo] = useState<DateRange>({ from: null, to: null })
	const [seatName, setSeatName] = useState("none")
	const [action, setAction] = useState("")


	useEffect(() => {
		const fromDate = createNewDate("09")
		const toDate = createNewDate("10")
		setFromTo({ from: fromDate, to: toDate })
		console.log("InitialData -> ", initialData)
		dispatch(setReserves({ reserveData: initialData }))
	}, [])


	useEffect(() => {
		// const reloadDataSession = async () => {
		//   if (fromTo.from && fromTo.to) {
		//     const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
		//     dispatch(setReserves({ reserveData: reloadData }))
		//   }
		// }

		// reloadDataSession()
	}, [session, fromTo])

	useEffect(() => {
		const event = new Event("visibilitychange");
		document.dispatchEvent(event);
	}, [status])

	return (
		<div
			className="room-create__container"
		>
			<Calendar
				setFromTo={setFromTo}
				setSeatName={setSeatName}
				setAction={setAction}
			/>
			{status === 'authenticated' ?
				<HandleOffice setSeatName={setSeatName} fromTo={fromTo} action={action} setAction={setAction} domain={domain} domainList={domainList}/>
				// <FirstOffice
				//   fromTo={fromTo}
				//   seatName={seatName}
				//   setSeatName={setSeatName}
				//   action={action}
				//   setAction={setAction}
				// />
				: <div className="spinner__center"><Spinner /></div>
			}

		</div>

	)

}

export default Prenota

export const getServerSideProps: GetServerSideProps = async (context) => {

	const session = await getSession(context)
	if (session === null || session.user === null) return { props: { initialData: null } }
	console.log(session.user!)
	let domain: any = ''
	let domainList: any = []
	if(session.user?.role !== 'ADMIN') {
		domain = await prisma.domain.findUnique({
			where: { id: session.user?.domainId! },
			include: { office: { include: { room: true } } }
		})
	} else {
		domainList = await prisma.domain.findMany({
			include: { office: { include: { room: true } } }
		})
	}

	console.log("DOMAIN -> ", domain)

	const fromDate = createNewDate("09")
	const toDate = createNewDate("10")
	const initialData = await prisma.reserve.findMany({
		include: {
			seat: true,
			user: true
		}
	})
	console.log("first appearance -> ", initialData)
	const filteredReserveDate = initialData.filter(r => !(r.from > new Date(toDate as string) || r.to < new Date(fromDate as string)))

	return {
		props: { initialData: JSON.parse(JSON.stringify(filteredReserveDate)), domain: domain, domainList: domainList }
	}
}