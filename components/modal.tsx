import { useEffect, useState } from "react";

// Axios
import axios from "axios";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setModalType, toggleModal } from "../features/modalSlice";
import {
	getDayReserves,
	getReserves,
	setDayReserves,
	setReserves,
} from "../features/reserveSlice";
import { getActualRoom } from "../features/roomSlice";

// Hooks
import { useAuthHook } from "../hooks/useAuthHook";

// Utils
import { getOnlyDate, getStringHours } from "../utils/datePharser";

// Icons
import { RiDeleteBin3Line } from "react-icons/ri";
import { TbClipboardCheck } from "react-icons/tb";

// Components
import ModalComponent from "./Ui/ModalComponent";
import ModalApprovation from "./Modals/ModalApprovation";
import ModalSingleReserve from "./Modals/ModalSingleReserve";

// Costants
import {
	ACCEPTED,
	APPROVE,
	Actions,
	MEET_WHOLE,
	ModalType,
	PENDING,
	PRISTINE,
	USER,
	WHOLE,
} from "../_shared";
import { FromToHour, HitModalButton, Reserve, Room, Seat } from "../types";

interface ModalProps {
	seatName: string;
	action: number;
	fromTo: FromToHour;
}

const Modal: React.FC<ModalProps> = (props): JSX.Element => {
	const { seatName, action, fromTo } = props;

	const dispatch = useDispatch();
	const reserveData = useSelector(getReserves);
	const reserveInDay = useSelector(getDayReserves);
	const roomId = useSelector(getActualRoom);

	const { userData } = useAuthHook();
	const userId = userData.id;
	const userRole = userData.role;

	const [hitModalButton, setHitModalButton] = useState<HitModalButton>({
		loading: false,
		id: null,
	});
	const [userReserve, setUserReserve] = useState<Reserve[]>([]);
	const [otherReserveInPeriod, setOtherReserveInPeriod] = useState<Reserve[]>(
		[]
	);
	const [motivation, setMotivation] = useState<string>("");

	const toApprove =
		reserveData && reserveData.length > 0
			? reserveData.filter(
					(res: Reserve) =>
						res?.seat?.type === MEET_WHOLE && res.status === PENDING
			  )
			: [];
	const reservedIndDay =
		reserveData && reserveData.length > 0
			? reserveData.filter(
					(res: Reserve) =>
						res?.seat?.type === MEET_WHOLE &&
						res.status === ACCEPTED
			  )
			: [];

	useEffect(() => {
		if (userRole === USER && reserveData && reserveData.length > 0) {
			setUserReserve(
				reserveData.filter((res: Reserve) => res.user.id === userId)
			);
		} else {
			setUserReserve(reserveData);
		}

		if (reserveData.length > 0) {
			setOtherReserveInPeriod(
				reserveData.filter(
					(reserve: Reserve) => reserve?.seat?.type !== MEET_WHOLE
				)
			);
		}
	}, [reserveData, userId, userRole]);

	const handleCloseModal = () => {
		reloadData();
		setHitModalButton({ loading: false, id: null });
		dispatch(toggleModal(false));
		dispatch(setModalType(PRISTINE));
	};

	async function reloadData() {
		// console.log('SET RES 2', fromTo, roomId)

		const reserves: Reserve[] = await (
			await axios.get(`/api/roomReserves/${roomId}`)
		).data;
		const reloadData = reserves.filter(
			(r: Reserve) =>
				fromTo.from &&
				fromTo.to &&
				r.to &&
				r.from &&
				((new Date(fromTo.from) <= new Date(r.from) &&
					new Date(fromTo.to) <= new Date(r.to) &&
					new Date(fromTo.to) > new Date(r.from)) ||
					(new Date(fromTo.from) >= new Date(r.from) &&
						new Date(fromTo.to) <= new Date(r.to)) ||
					(new Date(fromTo.from) <= new Date(r.from) &&
						new Date(fromTo.to) >= new Date(r.to)) ||
					(new Date(fromTo.from) >= new Date(r.from) &&
						new Date(fromTo.to) >= new Date(r.to) &&
						new Date(fromTo.from) < new Date(r.to))) &&
				r.seat?.roomId === roomId
		);

		const selectDate: string = fromTo.from ? getOnlyDate(fromTo.from) : "";
		const allDayReserve = reserves.filter(
			(r: Reserve) => selectDate === getOnlyDate(r.from)
		);

		dispatch(
			setDayReserves({
				dayReserveData: allDayReserve.filter(
					(r: Reserve) => r.user.id === userId
				),
				dayAllReserveData: allDayReserve,
			})
		);
		// Setta le prenotazioni all'ADD di una specifica
		dispatch(setReserves({ reserveData: reloadData }));
	}

	async function requestRoom() {
		setHitModalButton({ loading: true, id: null });
		const room: Room = await (await axios.get(`/api/room/${roomId}`)).data;
		const wholeRoom = room?.seat?.find((s: Seat) => s.type === WHOLE);

		try {
			await axios.post("/api/addReserve", {
				seatId: wholeRoom?.id,
				userId: userId,
				reservedDays: [],
				from: fromTo.from ? new Date(fromTo.from) : "",
				to: fromTo.to ? new Date(fromTo.to) : "",
				status: PENDING,
				motivation,
			});
			await reloadData();
			handleCloseModal();
			setMotivation("");
		} catch (error) {
			console.log(error);
		}
	}

	async function handleRoom() {
		setHitModalButton({ loading: true, id: null });

		const room: Room = await (await axios.get(`/api/room/${roomId}`)).data;
		const wholeRoom = room?.seat?.find((s: Seat) => s.type === WHOLE);

		await Promise.all(
			reserveData.map(async (reserve: Reserve) => {
				await axios.delete(`/api/reserve/${reserve.id}`);
				//TODO notify each user whose reservation has been cancelled
			})
		);

		try {
			await axios.post("/api/addReserve", {
				seatId: wholeRoom?.id,
				userId: userId,
				reservedDays: [],
				from: fromTo.from ? new Date(fromTo.from) : "",
				to: fromTo.to ? new Date(fromTo.to) : "",
				status: ACCEPTED,
				motivation,
			});
			await reloadData();
			handleCloseModal();
			setMotivation("");
		} catch (error) {
			console.log(error);
		}
	}

	async function handleSeat() {
		setHitModalButton({ loading: true, id: null });
		const seatId: string = await (
			await axios.get(`/api/seats/${seatName}`)
		).data?.id;
		const myReserveInDay = reserveInDay.filter(
			(r: Reserve) => r.user.id === userId && r.seat?.type !== WHOLE
		);
		let bookStatus =
			userRole === USER
				? myReserveInDay.length > 0
					? PENDING
					: ACCEPTED
				: ACCEPTED;

		if (action === Actions.ADD) {
			// Intervento pending state per utente USER se ha già effettuato una prenotazione
			try {
				await axios.post("/api/addReserve", {
					seatId: seatId,
					userId: userId,
					reservedDays: [],
					from: fromTo.from ? new Date(fromTo.from) : "",
					to: fromTo.to ? new Date(fromTo.to) : "",
					status: bookStatus,
					motivation,
				});
				setMotivation("");
			} catch (error) {
				console.log(error);
			}
		} else if (action === Actions.DELETE) {
			const reserveToDelete: Reserve | undefined = reserveData.find(
				(reserve: any) => reserve.seat.name === seatName
			);
			if (reserveToDelete) {
				await axios.delete("/api/reserve/" + reserveToDelete.id);
			}
		}

		handleCloseModal();
		if (fromTo) {
			await reloadData();
		}
	}

	async function handleApprovation(status: number, id: string) {
		setHitModalButton({ loading: true, id: id });
		if (status === APPROVE) {
			await axios.patch("/api/reserve/approveReserve", { id });
			await reloadData();
		} else {
			await (
				await axios.delete("/api/reserve/" + id)
			).data;

			// Se un user cancella la prenotazione accettata, in automatico viene accettata quella dopo
			const resDay = reserveInDay.filter(
				(r: Reserve) => r.userId === userId && r.id !== id
			);
			const alreadyAccepted = resDay.filter(
				(r: Reserve) => r.status === ACCEPTED
			).length;

			if (!alreadyAccepted) {
				const firstInPending = resDay.find(
					(r: Reserve) =>
						r.status === "pending" && r.seat?.type !== WHOLE
				) as Reserve;
				if (firstInPending) {
					const id = firstInPending.id;
					await axios.patch("/api/reserve/approveReserve", { id });
				}
			}

			const reserves: Reserve[] = await (
				await axios.get(`/api/roomReserves/${roomId}`)
			).data;
			const reloadData = reserves.filter(
				(r: Reserve) =>
					fromTo.from &&
					fromTo.to &&
					r.to &&
					r.from &&
					((new Date(fromTo.from) <= new Date(r.from) &&
						new Date(fromTo.to) <= new Date(r.to) &&
						new Date(fromTo.to) > new Date(r.from)) ||
						(new Date(fromTo.from) >= new Date(r.from) &&
							new Date(fromTo.to) <= new Date(r.to)) ||
						(new Date(fromTo.from) <= new Date(r.from) &&
							new Date(fromTo.to) >= new Date(r.to)) ||
						(new Date(fromTo.from) >= new Date(r.from) &&
							new Date(fromTo.to) >= new Date(r.to) &&
							new Date(fromTo.from) < new Date(r.to))) &&
					r.seat?.roomId === roomId
			);
			const selectDate = fromTo.from ? getOnlyDate(fromTo.from) : "";
			const allDayReserve = reserves.filter(
				(r: Reserve) => selectDate === getOnlyDate(r.from)
			);

			dispatch(
				setDayReserves({
					dayReserveData: allDayReserve.filter(
						(r: Reserve) => r.user.id === userId
					),
					dayAllReserveData: allDayReserve,
				})
			);

			// Setta le prenotazioni al DELETE su una specifica
			dispatch(setReserves({ reserveData: reloadData }));
			setHitModalButton({ loading: false, id: null });

			if (userReserve.length === 1) {
				handleCloseModal();
			}
		}
		if (
			(toApprove.length === 1 && reservedIndDay.length === 0) ||
			(toApprove.length === 0 && reservedIndDay.length === 1)
		) {
			handleCloseModal();
		}
	}

	return (
		<>
			{action === Actions.ADD ||
			action === Actions.ADDALL ||
			action === Actions.REQUESTALL ? (
				<ModalComponent
					modalTitle={`Aggiungi prenotazione`}
					subTitle={
						fromTo
							? `fascia oraria: ${getStringHours(
									fromTo.from
							  )} - ${getStringHours(fromTo.to)}`
							: ""
					}
					refType={ModalType.SEATS}
					handleCloseModal={handleCloseModal}
				>
					<ModalSingleReserve
						action={action}
						seatName={seatName}
						otherReserveInPeriod={otherReserveInPeriod}
						userReserve={userReserve}
						handleSeat={
							action === Actions.ADD
								? handleSeat
								: action === Actions.ADDALL
								? handleRoom
								: requestRoom
						}
						hitModalButton={hitModalButton}
						motivation={motivation}
						setMotivation={setMotivation}
					/>
				</ModalComponent>
			) : (
				<ModalComponent
					modalTitle={`${
						action === Actions.ADD ? "Aggiungi" : "Gestisci"
					} prenotazione`}
					subTitle={
						fromTo
							? `fascia oraria: ${getStringHours(
									fromTo.from
							  )} - ${getStringHours(fromTo.to)}`
							: ""
					}
					refType={ModalType.SEATS}
					handleCloseModal={handleCloseModal}
				>
					<ModalApprovation
						reserve={userReserve}
						approvationAction={handleApprovation}
						buttonIconDelete={<RiDeleteBin3Line size={18} />}
						buttonIconAccept={false}
						pendingControl={false}
						pendingReserve={[]}
						hitModalButton={hitModalButton}
					/>
				</ModalComponent>
			)}

			{userRole !== USER &&
				(action === Actions.APPROVE || action === Actions.MANAGE) && (
					<ModalComponent
						modalTitle={`${
							action === Actions.APPROVE ? "Approva" : "Gestisci"
						} prenotazione`}
						subTitle={
							fromTo
								? `fascia oraria: ${getStringHours(
										fromTo.from
								  )} - ${getStringHours(fromTo.to)}`
								: ""
						}
						refType={ModalType.APPROVE}
						handleCloseModal={handleCloseModal}
					>
						<ModalApprovation
							reserve={reservedIndDay}
							approvationAction={handleApprovation}
							buttonIconDelete={<RiDeleteBin3Line size={18} />}
							buttonIconAccept={<TbClipboardCheck size={18} />}
							pendingControl={true}
							pendingReserve={toApprove}
							hitModalButton={hitModalButton}
						/>
					</ModalComponent>
				)}
		</>
	);
};

export default Modal;
