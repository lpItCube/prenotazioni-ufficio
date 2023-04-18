interface NavigationStepperElementProps {
    onclick: () => void,
    label: string,
    icon: JSX.Element
}

const NavigationStepperElement: React.FC<NavigationStepperElementProps> = (props): JSX.Element => {
    const { onclick, label, icon } = props

    return (
        <div
            onClick={onclick}
            className="creation-stepper__item"
        >
            {label}
            {icon}
        </div>
    )
}

export default NavigationStepperElement