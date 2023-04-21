import { useState, useEffect } from 'react'

// Components
import Select from '../Ui/Select'
import Option from '../Ui/Option'
import Button from '../Ui/Button'
import { Colors } from '../Ui/Colors';
import TabBar from '../Ui/TabBar';
import Input from '../Ui/Input';

// Costants
import { DEFAULT_DOMAIN_VALUE, DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE, DirectionMode, EDIT_MODAL, StepperState } from '../../_shared';

// Framer motion
import { motion, AnimatePresence } from 'framer-motion';

// Types
import { Domain, FormMethod, ITabButton, Office, OptionItem, Room } from '../../types';

// Icons
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin3Line } from "react-icons/ri"
import { BsArrowRight } from "react-icons/bs";
import Textarea from '../Ui/Textarea';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getModalStatus, setModalType, toggleModal } from '../../features/modalSlice';


interface CreateActionProps {
	refState: any,
	label: string,
	defaultSelect: string,
	selectObj: OptionItem,
	openOption: boolean,
	optionList: Domain[] | Office[] | Room[],
	isActive: boolean,
	currentStepper: number,
	stepperState: number,
	createName: string,
	direction: number,
	description?: string,
	setDirection: (num: number) => void,
	setCreateName: (name: string) => void,
	handleCreation: (type: number) => void,
	handleSelect: () => void,
	setSelect: (selectObj: OptionItem) => void,
	setStepperState: (num: number) => void,
	setSelectedDomain: (item: OptionItem) => void,
	setSelectedOffice: (item: OptionItem) => void,
	setSelectedRoom: (item: OptionItem) => void,
	setDescription?: (desc: string) => void
}


const CreateAction: React.FC<CreateActionProps> = (props): JSX.Element => {

	const {
		refState,
		label,
		defaultSelect,
		selectObj,
		openOption,
		optionList,
		isActive,
		currentStepper,
		stepperState,
		createName,
		direction,
		description,
		setDirection,
		handleCreation,
		setCreateName,
		handleSelect,
		setSelect,
		setStepperState,
		setSelectedDomain,
		setSelectedOffice,
		setSelectedRoom,
		setDescription
	} = props

	const dispatch = useDispatch()
	const modalStatus = useSelector(getModalStatus)

	const [method, setMethod] = useState<number>(FormMethod.SELEZIONA)
	const [isDisabledSelect, setIsDisabledSelect] = useState<boolean>(false)

	const containerVariants = {
		initial: {
			opacity: 0,
			x: direction === DirectionMode.POSITIVE ? '100%' : '-100%',
		},
		animate: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.3,
				ease: 'easeInOut',
			},
		},
		exit: {
			opacity: 0,
			x: direction === DirectionMode.POSITIVE ? '-100%' : '100%',
			transition: {
				duration: 0.3,
				ease: 'easeInOut',
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
				ease: 'easeInOut',
			},
		},
		exit: {
			opacity: 0,
			y: direction === DirectionMode.POSITIVE ? 8 : -8,
			transition: {
				duration: 0.3,
				ease: 'easeInOut',
			},
		},
	};

	const buttonEnter = {
		initial: {
			right: -16,
			opacity: 0
		},
		animate: {
			opacity: 1,
			right: 0,
			transition: {
				duration: 0.2,
				ease: 'easeInOut',
			},
		},
		exit: {
			opacity: 0,
			right: -16,
			transition: {
				duration: 0.2,
				ease: 'easeInOut',
			},
		}
	}

	useEffect(() => {
		if (optionList.length > 0) {
			setIsDisabledSelect(false)
			setMethod(FormMethod.SELEZIONA)
		} else {
			setIsDisabledSelect(true)
			setMethod(FormMethod.AGGIUNGI)
		}
	}, [optionList])

	const tabButton: ITabButton[] = [
		{ text: 'Seleziona', value: FormMethod.SELEZIONA, disabled: isDisabledSelect },
		{ text: 'Aggiungi', value: FormMethod.AGGIUNGI, disabled: false }
	]

	const toggleMethod = (tab: number) => {
		setMethod(tab)
	}

	const handleEditRoom = () => {
		dispatch(toggleModal(!modalStatus))
		dispatch(setModalType(EDIT_MODAL))
	}

	const placeholder: string = stepperState === StepperState.DOMAIN
		? 'Aggiungi un dominio'
		: stepperState === StepperState.OFFICE
			? 'Aggiungi un ufficio'
			: stepperState === StepperState.ROOM
				? 'Aggiungi una stanza'
				: ''

	return (
		<AnimatePresence>
			{isActive
				? (
					<div
						className="creation-stepper__modal-wrapper"
						key={currentStepper}
					>
						<motion.div
							className='creation-stepper__modal-container'
							variants={containerVariants}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							<h3
								className='creation-stepper__modal-title'
							>
								{label}
							</h3>
							<div className='creation-stepper__actions-wrapper'>
								<TabBar
									tabButton={tabButton}
									onClick={toggleMethod}
									currentTab={method}
								/>
								<div className={`creation-stepper__actions-container${createName ? ' w-cta' : ''}`}>
									{method === FormMethod.SELEZIONA
										? (
											<Select
												label={''}
												value={selectObj ? selectObj.label : defaultSelect}
												onClick={() => handleSelect}
												openOption={openOption}
												refState={refState}
											>
												{optionList.map((option: Domain | Office | Room, key: number) =>
													<Option
														key={key}
														onClick={() => setSelect({ label: option.name, value: option.id })}
														label={option.name}
														className=""
													/>
												)}
											</Select>
										)
										: (
											<>
												<Input
													label={''}
													value={createName}
													onChange={setCreateName}
													placeholder={placeholder}
												/>
												<AnimatePresence>
													{createName &&
														<motion.div
															className='creation-stepper__actions-cta'
															variants={buttonEnter}
															key='cta'
															initial="initial"
															animate="animate"
															exit="exit"
														>
															<Button
																onClick={() => handleCreation(currentStepper)}
																className={`cta cta--primary cta__icon${!createName ? ' disabled' : ''}`}
																type='button'
																icon={<BsArrowRight size={20} color={Colors.white} />}
																text={''}
																disabled={!createName}
															/>
														</motion.div>
													}
												</AnimatePresence>
											</>
										)
									}
								</div>
								{stepperState === StepperState.ROOM && setDescription && method === FormMethod.AGGIUNGI &&
									<Textarea
										label={''}
										value={description ? description : ''}
										onChange={setDescription}
										placeholder={'Aggiungi una descrizione'}
									/>
								}
							</div>
						</motion.div>
					</div>
				)
				: selectObj.label !== defaultSelect && stepperState >= currentStepper
					? (
						<motion.div
							variants={labelVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							className='creation-stepper__box'
						>
							<RiDeleteBin3Line
								className="creation-stepper__box--remove"
								size={32}
								color={Colors.white}
								onClick={() => {
									setDirection(DirectionMode.NEGATIVE)
									setMethod(FormMethod.SELEZIONA)
									setTimeout(() => {
										setStepperState(currentStepper)
										if (currentStepper === StepperState.DOMAIN) {
											setSelectedDomain(DEFAULT_DOMAIN_VALUE)
										} else if (currentStepper === StepperState.OFFICE) {
											setSelectedOffice(DEFAULT_OFFICE_VALUE)
											setSelectedRoom(DEFAULT_ROOM_VALUE)
										} else if (currentStepper === StepperState.ROOM) {
											setSelectedRoom(DEFAULT_ROOM_VALUE)
										}
									}, 100)
								}}
							/>
							<div 
								className='creation-stepper__box--title'
								onClick={() => handleEditRoom()}
							>
								<p
									className="select__label label"
								>
									{label}
								</p>
								<p className='creation-stepper__room--name'>
									{selectObj.label}
									{currentStepper === StepperState.ROOM && 
										<TbEdit
											size={18}
											color={Colors.green700}
											className="creation-stepper__box--edit"
										/>
									}
								</p>
							</div>
						</motion.div>
					)
					: (
						null
					)
			}
		</AnimatePresence>
	)
}

export default CreateAction