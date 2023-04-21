interface InputProps {
    label: string,
    value: any,
    onChange: (text: string) => void,
    placeholder: string,
    refState?: any,
}

const Textarea: React.FC<InputProps> = (props): JSX.Element => {
    const { label, value, onChange, refState, placeholder } = props

    return (
        <div
            className="input__container description"
            ref={refState}
        >
            <p className="input__label label">{label}</p>
            <textarea
                className="input__value-container"
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                placeholder={placeholder}
                rows={3}
            />
        </div>
    )
}

export default Textarea