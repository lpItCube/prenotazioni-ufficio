type SelectProps = {
    label:string,
    value:any,
    onChange: (text:string) => void,
    placeholder:string,
    refState?:any,
}

function Input({
    label,
    value,
    onChange,
    refState,
    placeholder
}: SelectProps ) {
  return (
    <div
        className="input__container"
        ref={refState}
    >
        <p className="input__label label">{label}</p>
        <input
            className="input__value-container"
            type='text'
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            placeholder={placeholder}
        />
    </div>
  )
}

export default Input