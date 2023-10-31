// Components
import Button from "../Ui/Button";
import Spinner from "../Ui/Spinner";
import Link from "next/link";
import { IActions, IFields } from "../../types";

type FormProps = {
	fields: IFields[];
	actions?: IActions[];
	handleSubmit: any;
	isLoading: boolean;
	isLogin?: boolean;
	theme?: "dark" | "light";
};

function Form({
	fields,
	actions,
	handleSubmit,
	isLoading,
	isLogin,
	theme = "light",
}: FormProps) {
	return (
		<form onSubmit={handleSubmit}>
			<div className="form__input--wrapper">
				{fields.map((field: IFields) => {
					const { id, Component } = field;

					return <Component key={id} {...field} theme={theme} />;
				})}
				{isLogin && (
					<Link
						className="form__input--link"
						href={"/forgot-password"}
					>
						Password dimenticata?
					</Link>
				)}
			</div>
			{isLoading ? (
				<Spinner />
			) : (
				actions &&
				actions.map((action: IActions) => {
					const { id, buttonType } = action;
					return <Button key={id} type={buttonType} {...action} />;
				})
			)}
		</form>
	);
}

export default Form;
