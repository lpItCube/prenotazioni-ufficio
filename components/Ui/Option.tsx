type OptionProps = {
    onClick:any,
    label:string,
    className:string
}

function Option({
    onClick,
    label,
    className
} : OptionProps) {
  return (
    <div 
        className={`option__wrapper${className}`}
        onClick={() => onClick()}
    >
        {label}
    </div>
  )
}

export default Option