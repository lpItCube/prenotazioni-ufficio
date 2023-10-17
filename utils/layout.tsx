import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { Colors } from "../components/Ui/Colors";
import { CiLogin } from "react-icons/ci";
import { ILayout } from "../types";
import Input from "../components/form/Input";
import Link from "next/link";

export const FIELD_INPUT = "FIELD_INPUT";
export const FIELD_LINK = "FIELD_LINK";
const TEXT = "text";
const SUBMIT = "submit";
const LOGIN = "Login";
const PASSWORD = "password";
const EMAIL = "email";
const INVIO_IN_CORSO = "Invio in corso";
const LINK_RECUPERO = "Invia link di recupero";

export const getLoginLayout = (
	handleEmail: any,
	emailPlaceholder: string,
	emailName: string,
	handlePassword: any,
	passwordPlaceholder: string,
	passwordName: string,
	loginClassName: string,
	handleLogin: any,
	usernameValue: string,
	passwordValue: string
): ILayout => {
	return {
		fields: [
			{
				id: "Username field",
				Component: Input,
				fieldType: FIELD_INPUT,
				icon: <AiOutlineLock size={24} color={Colors.light700} />,
				onChange: handleEmail,
				type: TEXT,
				placeholder: emailPlaceholder,
				name: emailName,
				required: true,
				value: usernameValue,
			},
			{
				id: "Password field",
				Component: Input,
				fieldType: FIELD_INPUT,
				icon: <AiOutlineUser size={24} color={Colors.light700} />,
				onChange: handlePassword,
				type: PASSWORD,
				placeholder: passwordPlaceholder,
				name: passwordName,
				required: true,
				value: passwordValue,
			},
		],
		actions: [
			{
				id: "Login button",
				className: loginClassName,
				buttonType: SUBMIT,
				icon: <CiLogin size={24} />,
				text: LOGIN,
				onClick: handleLogin,
			},
		],
	};
};

export const getResetPasswordLayout = (
	emailPlaceholder: string,
	handleEmail: any,
	emailName: string,
	ctaClassName: string,
	handleSubmit: any,
	emailValue: string,
	isLoading: boolean
): ILayout => {
	return {
		fields: [
			{
				id: "Email field",
				Component: Input,
				fieldType: FIELD_INPUT,
				icon: <AiOutlineLock size={24} color={Colors.light700} />,
				onChange: handleEmail,
				type: EMAIL,
				placeholder: emailPlaceholder,
				name: emailName,
				required: true,
				value: emailValue,
			},
		],
		actions: [
			{
				id: "Change password button",
				className: ctaClassName,
				buttonType: SUBMIT,
				icon: null,
				text: isLoading ? INVIO_IN_CORSO : LINK_RECUPERO,
				onClick: handleSubmit,
			},
		],
	};
};
