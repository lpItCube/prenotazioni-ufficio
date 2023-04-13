import { useEffect, useState, useRef } from "react"
import HandleRoom from "./Create/HandleRoom"
import { useSession } from "next-auth/react"
import { useDispatch, useSelector } from "react-redux"
import { getModalStatus, setModalType, toggleModal } from "../features/modalSlice"
import { DirectionMode, StepperState } from "../_shared"
import CreateAction from "./Create/CreateAction"
import Select from "./Ui/Select"
import Option from "./Ui/Option"
import BookStepper from "./Book/BookStepper"
import Button from "./Ui/Button"
import BookAll from "./Rooms/BookAll"
import { getReserves } from "../features/reserveSlice"
import { useAuthHook } from "../hooks/useAuthHook"
import { getIsYourRoom } from "../features/roomSlice"
import { Reserve } from "../types"
import YourReserve from "./Rooms/YourReserve"

type Domain = {
	id: string
	name: string
	office: Office[]
}

type Office = {
	[x: string]: any
	id: string
	name: string
	domainId: string
	room: Room[]
}

type Room = {
	id: string
	name: string
	gridPoints: []
	officeId: string
	xSize: number
	ySize: number
}

function HandleOffice({ fromTo, action, setAction, domain, setSeatName }: { fromTo: any, action: any, setAction: any, domain: Domain, setSeatName: any }) {
	const session = useSession()
	const dispatch = useDispatch()
	const modalStatus: boolean = useSelector(getModalStatus)
	const officeRef = useRef<any>(null)
	const roomRef = useRef<any>(null)
	const [selectedOffice, setSelectedOffice] = useState<undefined | Office>(undefined)
	const [selectedRoom, setSelectedRoom] = useState<undefined | Room>(undefined)
	const [stepperState, setStepperState] = useState<number>(StepperState.OFFICE)
	const [openOffice, setOpenOffice] = useState<boolean>(false)
	const [openRoom, setOpenRoom] = useState<boolean>(false)
	const [direction, setDirection] = useState<number>(DirectionMode.POSITIVE)

	const reserveData = useSelector(getReserves)
	const { userData } = useAuthHook()
	const userRole = userData.role
	const needApproval = reserveData.filter((res: any) => res.seat.type === 'meet-whole' && res.status === 'pending').length > 0 && userRole !== 'USER'
	const notBookAll = userRole === 'USER' && reserveData.length > 0
	const isYourRoom = useSelector(getIsYourRoom)
	const role = session.data!.user!.role
	const userId = session.data!.user!.id
	const yourReserve:Reserve[] = reserveData.filter((res:any) => res.user.id === userId)



	useEffect(() => {
		// UseRef per controllare se il click è interno

		const handleClickOutside = (event: any) => {
			if (officeRef.current && !officeRef.current.contains(event.target)) {
				setOpenOffice(false)
			}
			if (roomRef.current && !roomRef.current.contains(event.target)) {
				setOpenRoom(false)
			}
		};
		window.addEventListener('click', handleClickOutside, true);
		return () => {
			window.removeEventListener('click', handleClickOutside, true);
		};
	}, [])


	useEffect(() => {
		const trueCount = [Boolean(selectedOffice?.name), Boolean(selectedRoom?.name)].reduce((count: any, bool: boolean) => count + bool, 1);
		setTimeout(() => {
			setStepperState(trueCount)
			setDirection(DirectionMode.POSITIVE)
		}, 100)
	}, [selectedOffice, selectedRoom])


	const handleSelectOffice = () => {
		setOpenOffice(prev => !prev)
	}

	const handleSelectRoom = () => {
		setOpenRoom(prev => !prev)
	}

	const handleOptionOffice = (officeId: string) => {
		// const officeId = e.target.value
		const office = domain.office.find((office: Office) => office.id === officeId)
		setSelectedOffice(office)
	}

	const handleOptionRoom = (roomId: string) => {
		// const roomId = e.target.value
		const room = selectedOffice!.room.find((room: Room) => room.id === roomId)
		setSelectedRoom(room)
	}


	const bookRoom = () => {
		//prenota tutti posti se sei admin
		dispatch(toggleModal(!modalStatus))
		dispatch(setModalType('seats-modal'))
		if (isYourRoom || role !== 'USER' && reserveData.length > 0 && !isYourRoom) {
			setAction('DELETE')
		} else {
			if (role !== "USER") {
				setAction("ADDALL")
			} else {
				setAction("REQUESTALL")
			}
		}
		//se non sei admin mandi una richiesta
	}


	// console.log(domain)
	return (
		<>
			<div className={`room-create__body creation-stepper__container ${stepperState > StepperState.ROOM ? 'creation-stepper__static' : 'creation-stepper__active'}`}>
				<div className="creation-stepper__navigation">

					<div
						className={`creation-stepper__element ${stepperState === StepperState.OFFICE ? '' : 'disabled'}`}
					>
						<BookStepper
							defaultSelect="Seleziona ufficio"
							currentStepper={StepperState.OFFICE}
							selectObj={selectedOffice}
							handleSelect={handleSelectOffice}
							openOption={openOffice}
							refState={officeRef}
							optionList={domain ? domain.office : []}
							setSelect={handleOptionOffice}
							isActive={stepperState === StepperState.OFFICE}
							stepperState={stepperState}
							label="Ufficio"
							setDirection={setDirection}
							direction={direction}
							setStepperState={setStepperState}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
						/>
					</div>
					<div
						className={`creation-stepper__element ${stepperState === StepperState.ROOM ? '' : 'disabled'}`}
					>
						<BookStepper
							defaultSelect="Seleziona stanza"
							currentStepper={StepperState.ROOM}
							selectObj={selectedRoom}
							handleSelect={handleSelectRoom}
							openOption={openRoom}
							refState={roomRef}
							optionList={selectedOffice ? selectedOffice.room : []}
							setSelect={handleOptionRoom}
							isActive={stepperState === StepperState.ROOM}
							stepperState={stepperState}
							label="Stanza"
							setDirection={setDirection}
							direction={direction}
							setStepperState={setStepperState}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
						/>
					</div>
				</div>
			</div>
			{selectedRoom && stepperState > StepperState.ROOM &&
				<>
					<Button
						onClick={bookRoom}
						disabled={role === 'USER' && reserveData.length > 0 && !isYourRoom}
						className={`cta square ${role === 'USER' && reserveData.length > 0 && !isYourRoom
							? 'disabled'
							: role !== 'USER' && reserveData.length > 0 && !isYourRoom
								? 'cta--primary-delete'
								: isYourRoom
									? 'cta--primary-delete'
									: 'cta--primary'
							}`}
						type='submit'
						icon={''}
						text={`${role === 'USER' && reserveData.length > 0 && !isYourRoom
							? 'Stanza non disponibile'
							: role !== 'USER' && reserveData.length > 0 && !isYourRoom
								? 'Gestisci prenotazione'
								: isYourRoom
									? 'Gestisci prenotazione'
									: 'Prenota stanza'
							}`}
					/>
				</>
			}
			{selectedRoom &&
				<HandleRoom fromTo={fromTo} action={action} setAction={setAction} roomId={selectedRoom.id} create={false} />
			}
		</>
	)
}

export default HandleOffice