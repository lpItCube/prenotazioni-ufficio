// Costants
import { DEFAULT_DOMAIN_VALUE, DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE, StepperState } from "../../_shared"

// Icons
import { TbEdit } from "react-icons/tb";

// Components
import { Colors } from "../Ui/Colors";
import NavigationStepperElement from "./NavigationStepperElement";

// Types
import { OptionItem } from "../../types";


interface StepperNavigatorProps {
    selectedDomain: OptionItem,
    selectedOffice: OptionItem,
    selectedRoom: OptionItem,
    stepperState: number,
    setStepperState: (num:number) => void,
    setSelectedDomain: (item:OptionItem) => void,
    setSelectedOffice: (item:OptionItem) => void,
    setSelectedRoom: (item:OptionItem) => void,
}

const StepperNavigator: React.FC<StepperNavigatorProps> = (props): JSX.Element => {
    
    const {
        selectedDomain,
        selectedOffice,
        selectedRoom,
        stepperState,
        setStepperState,
        setSelectedDomain,
        setSelectedOffice,
        setSelectedRoom
    } = props


    return (
        <div
            className="creation-stepper__navigation"
        >
            {selectedDomain.value !== '' && stepperState > StepperState.DOMAIN && (
                    <NavigationStepperElement
                        onclick={() => {
                            setStepperState(StepperState.DOMAIN)
                            setSelectedDomain(DEFAULT_DOMAIN_VALUE)
                        }}
                        label={selectedDomain.label}
                        icon={<TbEdit size={18} color={Colors.warning500} />}
                    />
                )
            }
            {selectedOffice.value !== '' && stepperState > StepperState.OFFICE && (
                    <NavigationStepperElement
                        onclick={() => {
                            setStepperState(StepperState.OFFICE)
                            setSelectedOffice(DEFAULT_OFFICE_VALUE)
                        }}
                        label={selectedOffice.label}
                        icon={<TbEdit size={18} color={Colors.warning500} />}
                    />
                )
            }
            {selectedRoom.value !== '' && stepperState > StepperState.ROOM && (
                    <NavigationStepperElement
                        onclick={() => {
                            setStepperState(StepperState.ROOM)
                            setSelectedRoom(DEFAULT_ROOM_VALUE)
                        }}
                        label={selectedRoom.label}
                        icon={<TbEdit size={18} color={Colors.warning500} />}
                    />
                )
            }
        </div>
    )
}

export default StepperNavigator