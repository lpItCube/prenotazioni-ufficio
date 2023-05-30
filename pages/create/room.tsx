import { useEffect, useState, useRef } from "react"

// Axios
import axios, { AxiosResponse } from "axios"

// Next
import { GetStaticProps } from "next"

// Components
import HandleRoom from "../../components/Create/HandleRoom"
import CreateAction from "../../components/Create/CreateAction"

// Prisma
import prisma from "../../lib/prisma"

// Costants
import { DEFAULT_DOMAIN_VALUE, DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE, DirectionMode, ModalType, PRISTINE, StepperState } from "../../_shared"
import { Domain, Office, OptionItem, Room } from "../../types"
import { useAuthHook } from "../../hooks/useAuthHook"
import ModalComponent from "../../components/Ui/ModalComponent"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { getModalType, setModalType, toggleModal } from "../../features/modalSlice"


const Room: React.FC = (): JSX.Element => {

	const officeRef = useRef<any>(null)
	const domainRef = useRef<any>(null)
	const roomRef = useRef<any>(null)

	const { userData } = useAuthHook()
	const username = userData.name
	const role = userData.role

	const dispatch = useDispatch()
	const modalType = useSelector(getModalType)

	const [domains, setDomains] = useState<Domain[]>([])
	const [offices, setOffices] = useState<Office[]>([])
	const [rooms, setRooms] = useState<Room[]>([])
	const [selectedDomain, setSelectedDomain] = useState<OptionItem>(DEFAULT_DOMAIN_VALUE);
	const [selectedOffice, setSelectedOffice] = useState<OptionItem>(DEFAULT_OFFICE_VALUE);
	const [selectedRoom, setSelectedRoom] = useState<OptionItem>(DEFAULT_ROOM_VALUE);
	const [stepperState, setStepperState] = useState<number>(StepperState.DOMAIN)
	const [openDominio, setOpenDominio] = useState<boolean>(false)
	const [openOffice, setOpenOffice] = useState<boolean>(false)
	const [openStanza, setOpenStanza] = useState<boolean>(false)
	const [createName, setCreateName] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [direction, setDirection] = useState<number>(DirectionMode.POSITIVE)
	const [action, setAction] = useState<number>(PRISTINE)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (domainRef.current && !domainRef.current.contains(event.target)) {
				setOpenDominio(false)
			}
			if (officeRef.current && !officeRef.current.contains(event.target)) {
				setOpenOffice(false)
			}
			if (roomRef.current && !roomRef.current.contains(event.target)) {
				setOpenStanza(false)
			}
		};
		window.addEventListener('click', handleClickOutside, true);
		return () => {
			window.removeEventListener('click', handleClickOutside, true);
		};
	}, [])

	useEffect(() => {
		const trueCount: number = [Boolean(selectedDomain.value), Boolean(selectedOffice.value), Boolean(selectedRoom.value)].reduce((count: any, bool: boolean) => count + bool, 0);
		setTimeout(() => {
			setStepperState(trueCount)
			// setCreateName('')
			setDirection(DirectionMode.POSITIVE)
		}, 100)
	}, [selectedDomain, selectedOffice, selectedRoom])


	useEffect(() => {

		const getDomains = async () => {
			const res: Domain[] = (await axios.get("/api/domain")).data
			if (res) setDomains(res)
		}
		getDomains()

	}, [selectedDomain, selectedOffice, selectedRoom])


	useEffect(() => {
		const domain = domains.find((domain) => domain.id === selectedDomain.value)
		if (domain && domain.hasOwnProperty("office") && domain.office.length > 0) {
			setOffices(domain.office)
		} else {
			setOffices([])
		}
	}, [domains, selectedDomain.value])


	useEffect(() => {
		const office = offices.find((office) => office.id === selectedOffice.value)
		if (office && office.hasOwnProperty("room") && office.room.length > 0) {
			setRooms(office.room)
		} else {
			setRooms([])
		}
	}, [offices, selectedOffice.value])



	useEffect(() => {
		setSelectedOffice({ label: 'Seleziona', value: '' })
		setSelectedRoom({ label: 'Seleziona', value: '' })
	}, [selectedDomain])


	useEffect(() => {
		setSelectedRoom({ label: 'Seleziona', value: '' })
	}, [selectedOffice])


	const handleCreation = async (type: number) => {
		if (type === StepperState.DOMAIN) {
			const res: AxiosResponse<Domain> = await axios.post("/api/domain", { name: createName })
			setSelectedDomain({ value: res.data.id, label: res.data.name })
			setDomains([...domains, res.data])
		} else if (type === StepperState.OFFICE) {
			const res: AxiosResponse<Office> = await axios.post("/api/office", { name: createName, domainId: selectedDomain.value })
			setSelectedOffice({ value: res.data.id, label: res.data.name })
			setOffices([...offices, res.data])
		} else if (type === StepperState.ROOM) {
			const res: AxiosResponse<Room> = await axios.post("/api/room", { name: createName, officeId: selectedOffice.value, description: description })
			setSelectedRoom({ value: res.data.id, label: res.data.name })
			setRooms([...rooms, res.data])
		}
		setCreateName('')
	}


	const handleSelectDomain = () => {
		setOpenDominio(prev => !prev)
	}

	const handleSelectOffice = () => {
		setOpenOffice(prev => !prev)
	}

	const handleSelectRoom = () => {
		setOpenStanza(prev => !prev)
	}


	return (
		<div
			className="room-create__container"
		>
			<div className={`room-create__body creation-stepper__container ${stepperState > StepperState.ROOM ? 'creation-stepper__static' : 'creation-stepper__active'}`}>
				<div className="creation-stepper__navigation">
					{/*Se il ruolo è superadmin allora può settare il dominio altrimenti no*/}
					<div
						className={`creation-stepper__element ${stepperState === StepperState.DOMAIN ? '' : 'disabled'}`}
					>
						<CreateAction
							label="Dominio"
							defaultSelect="Seleziona"
							refState={domainRef}
							selectObj={selectedDomain}
							openOption={openDominio}
							optionList={domains}
							isActive={stepperState === StepperState.DOMAIN}
							currentStepper={StepperState.DOMAIN}
							stepperState={stepperState}
							createName={createName}
							direction={direction}
							setDirection={setDirection}
							setCreateName={setCreateName}
							handleCreation={handleCreation}
							handleSelect={handleSelectDomain}
							setSelect={setSelectedDomain}
							setStepperState={setStepperState}
							setSelectedDomain={setSelectedDomain}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
						/>
					</div>

					<div
						className={`creation-stepper__element ${domains.length > 0 && selectedDomain.value && stepperState === StepperState.OFFICE ? '' : 'disabled'}`}
					>
						<CreateAction
							label="Ufficio"
							defaultSelect="Seleziona"
							refState={officeRef}
							selectObj={selectedOffice}
							openOption={openOffice}
							optionList={offices}
							isActive={domains.length > 0 && Boolean(selectedDomain.value) && stepperState === StepperState.OFFICE}
							currentStepper={StepperState.OFFICE}
							stepperState={stepperState}
							createName={createName}
							direction={direction}
							setDirection={setDirection}
							setCreateName={setCreateName}
							handleCreation={handleCreation}
							handleSelect={handleSelectOffice}
							setSelect={setSelectedOffice}
							setStepperState={setStepperState}
							setSelectedDomain={setSelectedDomain}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
						/>
					</div>

					<div
						className={`creation-stepper__element ${offices.length > 0 && selectedOffice.value && stepperState === StepperState.ROOM ? '' : 'disabled'}`}
					>
						<CreateAction
							label="Stanza"
							defaultSelect="Seleziona"
							refState={roomRef}
							selectObj={selectedRoom}
							openOption={openStanza}
							optionList={rooms}
							isActive={offices.length > 0 && Boolean(selectedOffice.value) && stepperState === StepperState.ROOM}
							currentStepper={StepperState.ROOM}
							stepperState={stepperState}
							createName={createName}
							direction={direction}
							setDirection={setDirection}
							setCreateName={setCreateName}
							handleCreation={handleCreation}
							handleSelect={handleSelectRoom}
							setSelect={setSelectedRoom}
							setStepperState={setStepperState}
							setSelectedDomain={setSelectedDomain}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
							setDescription={setDescription}
							description={description}
						/>
					</div>
				</div>

			</div>
			{selectedRoom.value &&
				<HandleRoom
					roomId={selectedRoom.value}
					create={true}
					action={action}
					setAction={setAction}
					setSelectedRoom={setSelectedRoom}
				/>
			}
		</div>
	)
}

export default Room

export const getStaticProps: GetStaticProps = async () => {
	const domains = await prisma.domain.findMany({
		include: {
			office: {
				include: { room: true }
			}
		}
	})
	return { props: { domains } }
}