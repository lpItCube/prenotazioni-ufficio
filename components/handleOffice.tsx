import { useEffect, useState, useRef } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getReserves } from "../features/reserveSlice";
import { getIsYourRoom } from "../features/roomSlice";
import {
	getModalStatus,
	setModalType,
	toggleModal,
} from "../features/modalSlice";

// Costants
import {
	ADDALL,
	DEFAULT_END_HOUR,
	DEFAULT_START_HOUR,
	DELETE,
	DirectionMode,
	REQUESTALL,
	SEATS_MODAL,
	StepperState,
	USER,
} from "../_shared";

// Components
import HandleRoom from "./Create/HandleRoom";
import BookStepper from "./Book/BookStepper";
import Button from "./Ui/Button";

// Hooks
import { useAuthHook } from "../hooks/useAuthHook";

// Type
import { Reserve, Domain, Office, Room, FromToHour } from "../types";
import { setEndHour, setStartHour } from "../features/timePickerSlice";

interface HandleOfficeProps {
	fromTo: FromToHour;
	action: number;
	setAction: (action: number) => void;
	domain: Domain | null;
	domainList: Domain[] | any;
}

const HandleOffice: React.FC<HandleOfficeProps> = (props): JSX.Element => {
	const { fromTo, action, setAction, domain, domainList } = props;

	const { userData } = useAuthHook();
	const userRole = userData.role;

	const dispatch = useDispatch();
	const modalStatus = useSelector(getModalStatus);
	const reserveData: Reserve[] = useSelector(getReserves);
	const isYourRoom: boolean = useSelector(getIsYourRoom);

	const domainRef = useRef<any>(null);
	const officeRef = useRef<any>(null);
	const roomRef = useRef<any>(null);

	const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
	const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
	const [stepperState, setStepperState] = useState<number>(
		StepperState.DOMAIN
	);
	const [openDomain, setOpenDomain] = useState<boolean>(false);
	const [openOffice, setOpenOffice] = useState<boolean>(false);
	const [openRoom, setOpenRoom] = useState<boolean>(false);
	const [direction, setDirection] = useState<number>(DirectionMode.POSITIVE);

	useEffect(() => {
		if (domainList.length === 0) {
			setSelectedDomain(domain);
		}
	}, [domain, domainList.length]);

	useEffect(() => {
		// UseRef per controllare se il click è interno
		const handleClickOutside = (event: any) => {
			if (
				domainRef.current &&
				!domainRef.current.contains(event.target)
			) {
				setOpenDomain(false);
			}
			if (
				officeRef.current &&
				!officeRef.current.contains(event.target)
			) {
				setOpenOffice(false);
			}
			if (roomRef.current && !roomRef.current.contains(event.target)) {
				setOpenRoom(false);
			}
		};
		window.addEventListener("click", handleClickOutside, true);
		return () => {
			window.removeEventListener("click", handleClickOutside, true);
		};
	}, []);

	useEffect(() => {
		const trueCount = [
			Boolean(selectedDomain?.name),
			Boolean(selectedOffice?.name),
			Boolean(selectedRoom?.name),
		].reduce((count: any, bool: boolean) => count + bool, 0);
		setTimeout(() => {
			setStepperState(trueCount);
			setDirection(DirectionMode.POSITIVE);
		}, 100);
	}, [selectedOffice, selectedRoom, selectedDomain]);

	const handleSelectDomain = () => {
		setOpenDomain((prev) => !prev);
	};

	const handleSelectOffice = () => {
		setOpenOffice((prev) => !prev);
	};

	const handleSelectRoom = () => {
		setOpenRoom((prev) => !prev);
	};

	const handleOptionDomain = (domainId: string) => {
		const domain = domainList.find(
			(domain: Domain) => domain.id === domainId
		);
		setSelectedDomain(domain);
	};

	const handleOptionOffice = (officeId: string) => {
		const office = selectedDomain?.office.find(
			(office: Office) => office.id === officeId
		);
		if (office) {
			setSelectedOffice(office);
		}
	};

	const handleOptionRoom = (roomId: string) => {
		const room = selectedOffice!.room.find(
			(room: Room) => room.id === roomId
		);
		if (room) {
			setSelectedRoom(room);
		}
	};

	const bookRoom = () => {
		dispatch(toggleModal(!modalStatus));
		dispatch(setModalType(SEATS_MODAL));
		if (
			isYourRoom ||
			(userRole !== USER && reserveData.length > 0 && !isYourRoom)
		) {
			setAction(DELETE);
		} else {
			if (userRole !== USER) {
				setAction(ADDALL);
			} else {
				setAction(REQUESTALL);
			}
		}
	};

	return (
		<>
			<div
				className={`room-create__body creation-stepper__container ${
					stepperState > StepperState.ROOM
						? "creation-stepper__static"
						: "creation-stepper__active"
				}`}
			>
				<div className="creation-stepper__navigation">
					<div
						className={`creation-stepper__element ${
							stepperState === StepperState.DOMAIN
								? ""
								: "disabled"
						}`}
					>
						<BookStepper
							defaultSelect="Seleziona dominio"
							currentStepper={StepperState.DOMAIN}
							selectObj={selectedDomain}
							handleSelect={handleSelectDomain}
							openOption={openDomain}
							refState={domainRef}
							optionList={domainList}
							setSelect={handleOptionDomain}
							isActive={stepperState === StepperState.DOMAIN}
							stepperState={stepperState}
							label="Dominio"
							setDirection={setDirection}
							direction={direction}
							setStepperState={setStepperState}
							setSelectedDomain={setSelectedDomain}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
						/>
					</div>
					<div
						className={`creation-stepper__element ${
							stepperState === StepperState.OFFICE
								? ""
								: "disabled"
						}`}
					>
						<BookStepper
							defaultSelect="Seleziona ufficio"
							currentStepper={StepperState.OFFICE}
							selectObj={selectedOffice}
							handleSelect={handleSelectOffice}
							openOption={openOffice}
							refState={officeRef}
							optionList={
								selectedDomain ? selectedDomain.office : []
							}
							setSelect={handleOptionOffice}
							isActive={stepperState === StepperState.OFFICE}
							stepperState={stepperState}
							label="Ufficio"
							setDirection={setDirection}
							direction={direction}
							setStepperState={setStepperState}
							setSelectedDomain={setSelectedDomain}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
						/>
					</div>
					<div
						className={`creation-stepper__element ${
							stepperState === StepperState.ROOM ? "" : "disabled"
						}`}
					>
						<BookStepper
							defaultSelect="Seleziona stanza"
							currentStepper={StepperState.ROOM}
							selectObj={selectedRoom}
							handleSelect={handleSelectRoom}
							openOption={openRoom}
							refState={roomRef}
							optionList={
								selectedOffice ? selectedOffice.room : []
							}
							setSelect={handleOptionRoom}
							isActive={stepperState === StepperState.ROOM}
							stepperState={stepperState}
							label="Stanza"
							setDirection={setDirection}
							direction={direction}
							setStepperState={setStepperState}
							setSelectedDomain={setSelectedDomain}
							setSelectedOffice={setSelectedOffice}
							setSelectedRoom={setSelectedRoom}
						/>
					</div>
				</div>
			</div>
			{selectedRoom && stepperState > StepperState.ROOM && (
				<>
					<Button
						onClick={bookRoom}
						disabled={
							userRole === USER &&
							reserveData.length > 0 &&
							!isYourRoom
						}
						className={`cta square ${
							userRole === USER &&
							reserveData.length > 0 &&
							!isYourRoom
								? "disabled"
								: userRole !== USER &&
								  reserveData.length > 0 &&
								  !isYourRoom
								? "cta--primary-delete"
								: isYourRoom
								? "cta--primary-delete"
								: "cta--primary"
						}`}
						type="submit"
						icon={false}
						text={`${
							userRole === USER &&
							reserveData.length > 0 &&
							!isYourRoom
								? "Stanza non disponibile"
								: userRole !== USER &&
								  reserveData.length > 0 &&
								  !isYourRoom
								? "Gestisci prenotazione"
								: isYourRoom
								? "Gestisci prenotazione"
								: "Prenota stanza"
						}`}
					/>
				</>
			)}
			{selectedRoom && (
				<HandleRoom
					fromTo={fromTo}
					action={action}
					setAction={setAction}
					roomId={selectedRoom.id}
					create={false}
				/>
			)}
		</>
	);
};

export default HandleOffice;
