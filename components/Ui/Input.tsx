interface InputProps {
	label: string;
	value: any;
	onChange: (text: string) => void;
	placeholder: string;
	refState?: any;
	required?: boolean;
	type?: string;
}

const Input: React.FC<InputProps> = (props): JSX.Element => {
	const {
		label,
		value,
		onChange,
		refState,
		placeholder,
		required,
		type = "text",
	} = props;

	return (
		<div className="input__container" ref={refState}>
			<p className="input__label label">{label}</p>
			<input
				className="input__value-container"
				type={type}
				value={value}
				onChange={(e) => onChange(e.currentTarget.value)}
				placeholder={placeholder}
				required={required}
			/>
		</div>
	);
};

export default Input;
