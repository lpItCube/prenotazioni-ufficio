interface SelectProps {
    label: string,
    value: string,
    children: any,
    onClick: () => any,
    openOption: boolean,
    refState?: any
}

const Select: React.FC<SelectProps> = (props): JSX.Element => {

    const { label, value, children, onClick, openOption, refState } = props
    
    return (
        <div
            className="select__container"
            onClick={onClick()}
            ref={refState}
        >
            <p className="select__label label">{label}</p>
            <div className="select__value-container">
                {value}
            </div>

            <div className={`select__options${openOption ? ' is-open' : ''}`}>
                {children}
            </div>

        </div>
    )
}

export default Select