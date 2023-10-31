import axios from "axios";
import { useState } from "react";
import { getResetPasswordLayout } from "../../utils/layout";
import Form from "../../components/form/Form";
import ErrorAlert from "../../components/form/ErrorAlert";

function ResetPassword() {
	const [email, setEmail] = useState<string>("");
	const [isLoading, setLoading] = useState<boolean>(false);
	const [sendMessage, setSendMessage] = useState<null | string>(null);
	const [isValidate, setIsValidate] = useState<boolean>(false);

	const handleForgot = async (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSendMessage(null);
		try {
			setLoading(true);
			const response = await axios.post("api/reset_pwd", {
				email: email,
			});
			setIsValidate(true);
			setSendMessage(response.data.msg);
		} catch (err: any) {
			const { message } = err;

			setSendMessage(message);
			setIsValidate(false);
		}
		setLoading(false);
	};

	const handleEmail = (e: any) => {
		console.log(e.target.value);
		setEmail(e.target.value);
	};

	const handleSubmit = () => {};

	const layout = getResetPasswordLayout(
		"Il tuo indirizzo email",
		handleEmail,
		"email",
		"cta cta--primary cta__icon--right",
		handleSubmit,
		email,
		isLoading
	);

	return (
		<div className="loginContainer">
			<div className="loginModal">
				{sendMessage && (
					<ErrorAlert title={sendMessage} isValidate={isValidate} />
				)}
				<Form
					{...layout}
					handleSubmit={handleForgot}
					isLoading={isLoading}
					theme="dark"
				/>
			</div>
		</div>
	);
}

export default ResetPassword;
