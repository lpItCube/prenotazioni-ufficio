// Types
import { InputLoginProps } from "../../types";

const Input: React.FC<InputLoginProps> = (props): JSX.Element => {
	const {
		icon,
		onChange,
		type,
		placeholder,
		name,
		required,
		value,
		theme,
		label,
	} = props;

	return (
		<>
			{label && (
				<p className={`input__label label theme-${theme}`}>{label}</p>
			)}
			<div
				className={`content-input theme-${theme} ${
					!icon ? "default-input" : "icon-input"
				}`}
			>
				{icon && <div className="content-input__icon">{icon}</div>}
				<input
					type={type}
					placeholder={placeholder}
					value={value}
					name={name}
					onChange={(e) => onChange(e)}
					required={required}
				/>
			</div>
		</>
	);
};

export default Input;
