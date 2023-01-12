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
            icon
        }
    </button>
  )
}

export default Button