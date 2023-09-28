// Costants
import {
	ADMIN,
	DEFAULT_DOMAIN_VALUE,
	DEFAULT_END_HOUR,
	DEFAULT_OFFICE_VALUE,
	DEFAULT_ROOM_VALUE,
	DEFAULT_START_HOUR,
	DirectionMode,
	READ_MODAL,
	StepperState,
	USER,
} from "../../_shared";

// Components
import Select from "../Ui/Select";
import Option from "../Ui/Option";
import { Colors } from "../Ui/Colors";

// Framer
import { AnimatePresence, motion } from "framer-motion";

// Icons
import { RiDeleteBin3Line } from "react-icons/ri";
import { BiInfoCircle } from "react-icons/bi";

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";
import { BookStepperObj } from "../../types";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
	getModalStatus,
	setModalType,
	toggleModal,
} from "../../features/modalSlice";
import { setEndHour, setStartHour } from "../../features/timePickerSlice";

interface BookStepperProps {
	defaultSelect: string;
	currentStepper: number;
	selectObj: BookStepperObj | null;
	handleSelect: () => any;
	openOption: boolean;
	refState: any;
	optionList: any[];
	setSelect: (id: string) => void;
	isActive: boolean;
	stepperState: number;
	label: string;
	setDirection: (dir: number) => void;
	direction: number;
	setStepperState: (step: number) => void;
	setSelectedDomain: (domain: any) => void;
	setSelectedOffice: (office: any) => void;
	setSelectedRoom: (room: any) => void;
}

const BookStepper: React.FC<BookStepperProps> = (props): JSX.Element => {
	const {
		defaultSelect,
		currentStepper,
		selectObj,
		handleSelect,
		openOption,
		refState,
		optionList,
		setSelect,
		isActive,
		stepperState,
		label,
		setDirection,
		direction,
		setStepperState,
		setSelectedDomain,
		setSelectedOffice,
		setSelectedRoom,
	} = props;

	const { userData } = useAuthHook();
	const userRole = userData.role;

	const dispatch = useDispatch();
	const modalStatus = useSelector(getModalStatus);

	const containerVariants = {
		initial: {
			opacity: 0,
			x: direction === DirectionMode.POSITIVE ? "100%" : "-100%",
		},
		animate: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
				type: "spring",
				stiffness: 260,
				damping: 20,
			},
		},
		exit: {
			opacity: 0,
			x: direction === DirectionMode.POSITIVE ? "-100%" : "100%",
			transition: {
				duration: 0.3,
				ease: "easeInOut",
				type: "spring",
				stiffness: 260,
				damping: 20,
			},
		},
	};

	const labelVariants = {
		initial: {
			opacity: 0,
			y: direction === DirectionMode.POSITIVE ? -8 : 8,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
				type: "spring",
				stiffness: 260,
				damping: 20,
			},
		},
		exit: {
			opacity: 0,
			y: direction === DirectionMode.POSITIVE ? 8 : -8,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
				type: "spring",
				stiffness: 260,
				damping: 20,
			},
		},
	};

	const handleInfoRoom = () => {
		dispatch(toggleModal(!modalStatus));
		dispatch(setModalType(READ_MODAL));
	};

	return (
		<AnimatePresence>
			{isActive ? (
				<div
					className="creation-stepper__modal-wrapper"
					key={currentStepper}
				>
					<motion.div
						className="creation-stepper__modal-container"
						variants={containerVariants}
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<h3 className="creation-stepper__modal-title">
							{label}
						</h3>
						<div className="creation-stepper__actions-wrapper">
							<div
								className={`creation-stepper__actions-container`}
							>
								<Select
									label={""}
									value={
										selectObj && selectObj.name
											? selectObj.name
											: defaultSelect
									}
									onClick={() => handleSelect}
									openOption={openOption}
									refState={refState}
								>
									{optionList.map(
										(office: any, key: number) => (
											<Option
												key={key}
												onClick={() =>
													setSelect(office.id)
												}
												label={office.name}
												className=""
											/>
										)
									)}
								</Select>
							</div>
						</div>
					</motion.div>
				</div>
			) : stepperState >= currentStepper ? (
				<motion.div
					variants={labelVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					className="creation-stepper__box"
				>
					{((userRole === USER &&
						currentStepper !== StepperState.DOMAIN) ||
						userRole !== USER) && (
						<RiDeleteBin3Line
							className="creation-stepper__box--remove"
							size={32}
							color={Colors.white}
							onClick={() => {
								dispatch(setStartHour(DEFAULT_START_HOUR));
								dispatch(setEndHour(DEFAULT_END_HOUR));

								setDirection(DirectionMode.NEGATIVE);
								setTimeout(() => {
									setStepperState(currentStepper);
									if (
										currentStepper === StepperState.DOMAIN
									) {
										setSelectedDomain(DEFAULT_DOMAIN_VALUE);
										setSelectedOffice(DEFAULT_OFFICE_VALUE);
										setSelectedRoom(DEFAULT_ROOM_VALUE);
									} else if (
										currentStepper === StepperState.OFFICE
									) {
										setSelectedOffice(DEFAULT_OFFICE_VALUE);
										setSelectedRoom(DEFAULT_ROOM_VALUE);
									} else if (
										currentStepper === StepperState.ROOM
									) {
										setSelectedRoom(DEFAULT_ROOM_VALUE);
									}
								}, 100);
							}}
						/>
					)}
					<div
						className="creation-stepper__box--title"
						onClick={() =>
							currentStepper === StepperState.ROOM &&
							selectObj?.description &&
							handleInfoRoom()
						}
					>
						<p className="select__label label">{label}</p>
						<p className="creation-stepper__room--name">
							{selectObj?.name}
							{currentStepper === StepperState.ROOM &&
								selectObj?.description && (
									<BiInfoCircle
										size={18}
										color={Colors.green700}
										className="creation-stepper__box--edit"
									/>
								)}
						</p>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};

export default BookStepper;
