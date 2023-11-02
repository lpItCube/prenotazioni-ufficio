import axios from "axios";
import { useState, useEffect } from "react";
import Input from "../Ui/Input";
import Button from "../Ui/Button";
import { getChangePasswordLayout } from "../../utils/layout";
import Form from "../form/Form";
import ErrorAlert from "../form/ErrorAlert";

interface ChangePwdProps {
	userId: string;
	theme: "dark" | "light";
	onSuccess: () => void;
}

const ChangePwd: React.FC<ChangePwdProps> = (props) => {
	const { userId, theme, onSuccess } = props;

	const [newPassword, setNewPassword] = useState<null | string>(null);
	const [confirmPassword, setConfirmPassword] = useState<null | string>(null);
	const [passwordChanged, setPasswordChanged] = useState<Boolean>(false);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const handlePasswordChange = async () => {
		if (!newPassword) {
			setPasswordError("La password è richiesta");
			return;
		}
		if (!confirmPassword) {
			setPasswordError("La conferma della password è richiesta");
			return;
		}
		if (newPassword !== confirmPassword) {
			setPasswordError("Le password non coincidono");
			return;
		}
		try {
			await axios.post("/api/change_pwd", {
				userId,
				newPassword,
			});
		} catch (error) {
			console.log(error);
		}
		setPasswordChanged(true);
	};

	const handleNewPassword = (e: any) => {
		setPasswordError(null);
		setNewPassword(e.target.value);
	};

	const handleConfirmPassword = (e: any) => {
		setPasswordError(null);
		setConfirmPassword(e.target.value);
	};

	const layout = getChangePasswordLayout(
		handleNewPassword,
		newPassword,
		handleConfirmPassword,
		confirmPassword,
		handlePasswordChange
	);

	const handleSubmit = (e: any) => {
		e.preventDefault();
	};

	useEffect(() => {
		if (passwordChanged) {
			onSuccess();
		}
	}, [passwordChanged, onSuccess]);

	return (
		<>
			<div>
				{passwordError && (
					<ErrorAlert title={"Attenzione"} text={passwordError} />
				)}
				<Form
					{...layout}
					handleSubmit={handleSubmit}
					isLoading={false}
					isLogin={false}
					theme={theme}
				/>
			</div>
		</>
	);
};

export default ChangePwd;
