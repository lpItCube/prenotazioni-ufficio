// Types
import { InputLoginProps } from "../../types";

const Input: React.FC<InputLoginProps> = (props): JSX.Element => {
	const { icon, onChange, type, placeholder, name, required, value } = props;

	console.log(value);
	return (
		<div className="content-input">
			<div className="content-input__icon">{icon}</div>
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				name={name}
				onChange={(e) => onChange(e)}
				required={required}
			/>
		</div>
	);
};

export default Input;
