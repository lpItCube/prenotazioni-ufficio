import { DEFAULT_DOMAIN_VALUE, DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE, StepperState } from "../../_shared"
import { TbEdit } from "react-icons/tb";
import { Colors } from "../Ui/Colors";
import NavigationStepperElement from "./NavigationStepperElement";

interface ICreationObj {
    label: string,
    value: string
}
type OptionItem = {
    value: string,
    label: string
  }
interface StepperNavigatorProps {
    selectedDomain: ICreationObj,
    selectedOffice: ICreationObj,
    selectedRoom: ICreationObj,
    stepperState: number,
    setStepperState: (num:number) => void,
    setSelectedDomain: (item:OptionItem) => void,
    setSelectedOffice: (item:OptionItem) => void,
    setSelectedRoom: (item:OptionItem) => void,
}

function StepperNavigator(props: StepperNavigatorProps) {
    
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