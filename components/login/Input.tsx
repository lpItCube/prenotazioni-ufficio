// Types
import { InputLoginProps } from "../../types"


const Input: React.FC<InputLoginProps> = (props): JSX.Element => {

    const { icon, handleInfo, type, placeholder, name, required } = props

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