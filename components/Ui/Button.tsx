type ButtonProps = {
    onClick:any,
    className:string,
    type:any,
    icon:any,
    text:any,
    disabled?:boolean
}

function Button({
    onClick,
    className,
    type,
    icon,
    text,
    disabled
} : ButtonProps ) {
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