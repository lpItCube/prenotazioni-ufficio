type SelectProps = {
    label:string,
    value:any,
    children:any,
    onClick:any,
    openOption:boolean,
    refState?:any
}

function Select({
    label,
    value,
    children,
    onClick,
    openOption,
    refState
}: SelectProps ) {
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