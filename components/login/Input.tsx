
type InputProps = {
    icon:any,
    handleInfo:any,
    type:string,
    placeholder:string,
    name:string,
    required:boolean
}

function Input({
    icon,
    handleInfo,
    type,
    placeholder,
    name,
    required
}: InputProps) {
    return (
        <div className="content-input">
            <div className="content-input__icon">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                onChange={({ target }) => {
                    handleInfo(target)
                }}
                required={required}
            />
        </div>
    )
}

export default Input