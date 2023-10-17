import React from "react";

// Types
import { AlertProps } from "../../types";

const ErrorAlert: React.FC<AlertProps> = (props): JSX.Element => {
	const { title, text, isValidate } = props;

	return (
		<div className="alert">
			<p
				className={`alert__title min ${
					isValidate ? "valid" : "invalid"
				}`}
			>
				{title}
			</p>
			{text && (
				<p
					className={`alert__text min ${
						isValidate ? "valid" : "invalid"
					}`}
				>
					{text}
				</p>
			)}
		</div>
	);
};

export default ErrorAlert;
