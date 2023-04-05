import { DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE, DirectionMode, StepperState } from "../../_shared"
import Select from "../Ui/Select"
import Option from "../Ui/Option"
import { AnimatePresence, motion } from "framer-motion"
import { RiDeleteBin3Line } from "react-icons/ri"
import { Colors } from "../Ui/Colors"

interface BookStepperProps {
    defaultSelect: string,
    currentStepper: number,
    selectObj: any,
    handleSelect: () => any,
    openOption: boolean,
    refState: any,
    optionList: any[],
    setSelect: (id: string) => void,
    isActive: boolean,
    stepperState: number,
    label: string,
    setDirection: (dir: number) => void,
    direction: number,
    setStepperState: (step: number) => void,
    setSelectedOffice: (office: any) => void,
    setSelectedRoom: (room: any) => void
}

function BookStepper(props: BookStepperProps) {
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
        setSelectedOffice,
        setSelectedRoom
    } = props

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
                                <div className={`creation-stepper__actions-container`}>

                                    <Select
                                        label={''}
                                        value={selectObj && selectObj.name ? selectObj.name : defaultSelect}
                                        onClick={() => handleSelect}
                                        openOption={openOption}
                                        refState={refState}
                                    >
                                        {optionList.map((office: any, key: number) =>
                                            <Option
                                                key={key}
                                                onClick={() => setSelect(office.id)}
                                                label={office.name}
                                                className=""
                                            />
                                        )}
                                    </Select>
                                </div>
                            </div>

                        </motion.div>

                    </div>
                ) : (
                    stepperState >= currentStepper
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
                                        setTimeout(() => {
                                            setStepperState(currentStepper)
                                            if (currentStepper === StepperState.OFFICE) {
                                                setSelectedOffice(DEFAULT_OFFICE_VALUE)
                                                setSelectedRoom(DEFAULT_ROOM_VALUE)
                                            } else if (currentStepper === StepperState.ROOM) {
                                                setSelectedRoom(DEFAULT_ROOM_VALUE)
                                            }
                                        }, 100)
                                    }}
                                />
                                <div className='creation-stepper__box--title'>
                                    <p
                                        className="select__label label"
                                    >
                                        {label}
                                    </p>
                                    <p>
                                        {selectObj.name}
                                    </p>
                                </div>
                            </motion.div>
                        ) : null
                )
            }
        </AnimatePresence>
    )
}

export default BookStepper