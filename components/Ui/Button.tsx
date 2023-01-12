type ButtonProps = {
    className:string,
    type:any,
    icon:any,
    text:string
}

function Button({
    className,
    type,
    icon,
    text
} : ButtonProps ) {
  return (
    <button 
        className={className} 
        type={type}
    >
        <p
            className="min"
        >
            {text}
        </p>
        {icon && 
            <div className="icon__inner--container">
                {icon}
            </div>
        }
    </button>
  )
}

export default Button