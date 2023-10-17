export interface AlertProps {
	title: String;
	text?: String;
	isValidate?: boolean;
}

export interface InputLoginProps {
	icon: any;
	onChange: (e: any) => void;
	type: string;
	placeholder: string;
	name: string;
	required: boolean;
	value: any;
}

export interface UserInfo {
	email: string;
	password: string;
}

export interface IFields {
	id: string;
	Component: any;
	fieldType: string;
	icon?: JSX.Element | null;
	onChange?: () => void;
	type?: string;
	placeholder?: string;
	name?: string;
	required?: boolean;
	href?: string;
	className?: string;
	value?: any;
}

export interface IActions {
	id: string;
	className: string;
	buttonType: "button" | "submit" | "reset" | undefined;
	icon: JSX.Element | null;
	text: string;
	onClick: () => void;
}

export interface ILayout {
	fields: IFields[];
	actions?: IActions[];
}
