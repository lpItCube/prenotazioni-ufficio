type ButtonProps = {
    onClick:any,
    className:string,
    type:any,
    icon:any,
    text:any
}

function Button({
    onClick,
    className,
    type,
    icon,
    text
} : ButtonProps ) {
  return (
    <button 
        className={className} 
        type={type}
        onClick={onClick}
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