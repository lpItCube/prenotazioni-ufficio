type SelectProps = {
    label:string,
    value:any,
    children:any,
    onClick:any,
    openOption:boolean
}

function Select({
    label,
    value,
    children,
    onClick,
    openOption
}: SelectProps ) {
  return (
    <div
        className="select__container"
        onClick={onClick()}
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