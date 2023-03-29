import { DEFAULT_DOMAIN_VALUE, DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE } from "../../_shared"
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
            {selectedDomain.value !== '' && stepperState > 0 && (
                    <NavigationStepperElement
                        onclick={() => {
                            setStepperState(0)
                            setSelectedDomain(DEFAULT_DOMAIN_VALUE)
                        }}
                        label={selectedDomain.label}
                        icon={<TbEdit size={18} color={Colors.warning500} />}
                    />
                )
            }
            {selectedOffice.value !== '' && stepperState > 1 && (
                    <NavigationStepperElement
                        onclick={() => {
                            setStepperState(1)
                            setSelectedOffice(DEFAULT_OFFICE_VALUE)
                        }}
                        label={selectedOffice.label}
                        icon={<TbEdit size={18} color={Colors.warning500} />}
                    />
                )
            }
            {selectedRoom.value !== '' && stepperState > 2 && (
                    <NavigationStepperElement
                        onclick={() => {
                            setStepperState(2)
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