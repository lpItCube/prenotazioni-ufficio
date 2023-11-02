import { useEffect, useState } from "react";

// Next
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";

// Prisma
import prisma from "../../lib/prisma";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setReserves } from "../../features/reserveSlice";

// Components
import Calendar from "../../components/calendar";
import Spinner from "../../components/Ui/Spinner";
import HandleOffice from "../../components/handleOffice";

// Types
import { Domain, FromToHour, Reserve } from "../../types";

// Utils
import { createNewDate } from "../../utils/datePharser";
import {
	ADMIN,
	AUTH_OK,
	DEFAULT_END_HOUR,
	DEFAULT_START_HOUR,
	PRISTINE,
	USER,
} from "../../_shared";
import { getEndHour, getStartHour } from "../../features/timePickerSlice";
import Layout from "../../components/Layout";

interface PrenotaProps {
	initialData: Reserve;
	domain: Domain;
	domainList: Domain;
}

const Prenota: React.FC<PrenotaProps> = (props): JSX.Element => {
	const dispatch = useDispatch();
	const { status } = useSession();
	const startHour = useSelector(getStartHour);
	const endHour = useSelector(getEndHour);

	const { initialData, domain, domainList } = props;
	const [fromTo, setFromTo] = useState<FromToHour>({ from: null, to: null });
	const [action, setAction] = useState<number>(PRISTINE);

	useEffect(() => {
		const fromDate = createNewDate(DEFAULT_START_HOUR);
		const toDate = createNewDate(DEFAULT_END_HOUR);
		setFromTo({ from: fromDate, to: toDate });
		// Setta le prenotazioni al primo loading
		dispatch(setReserves({ reserveData: initialData }));
	}, [dispatch, initialData]);

	useEffect(() => {
		const event = new Event("visibilitychange");
		document.dispatchEvent(event);
	}, [status]);

	return (
		<Layout>
			<div className="room-create__container">
				<Calendar setFromTo={setFromTo} />
				{status === AUTH_OK ? (
					<HandleOffice
						fromTo={fromTo}
						action={action}
						setAction={setAction}
						domain={domain}
						domainList={domainList}
					/>
				) : (
					<div className="spinner__center">
						<Spinner />
					</div>
				)}
			</div>
		</Layout>
	);
};

export default Prenota;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session === null || session.user === null)
		return { props: { initialData: null } };
	let domain: Domain | any = "";
	let domainList: Domain[] | any = [];
	if (session.user?.role === USER) {
		domain = await prisma.domain.findUnique({
			where: { id: session.user?.domainId! },
			include: { office: { include: { room: true } } },
		});
	} else {
		domainList = await prisma.domain.findMany({
			include: { office: { include: { room: true } } },
		});
	}

	// console.log("DOMAIN -> ", session.user?.role)
	// console.log("DOMAIN -> ", domainList)

	const fromDate = createNewDate(DEFAULT_START_HOUR);
	const toDate = createNewDate(DEFAULT_END_HOUR);
	const initialData = await prisma.reserve.findMany({
		include: {
			seat: true,
			user: true,
		},
	});
	// console.log("first appearance -> ", initialData)
	const filteredReserveDate = initialData.filter(
		(r) => !(r.from > new Date(toDate) || r.to < new Date(fromDate))
	);

	return {
		props: {
			initialData: JSON.parse(JSON.stringify(filteredReserveDate)),
			domain: domain,
			domainList: domainList,
		},
	};
};
