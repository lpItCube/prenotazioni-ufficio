interface ButtonProps {
    onClick: () => void,
    className: string,
    type: "button" | "submit" | "reset" | undefined,
    icon: JSX.Element | boolean,
    text: string,
    disabled?: boolean
}

const Button: React.FC<ButtonProps> = (props): JSX.Element => {

    const { onClick, className, type, icon, text, disabled } = props

    return (
        <button
            className={className}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {text &&
                <p
                    className="min"
                >
                    {text}
                </p>
            }
            {icon &&
                <div className={`icon__inner--container${text ? ' marginate' : ''}`}>
                    {icon}
                </div>
            }
        </button>
    )
}

export default Button