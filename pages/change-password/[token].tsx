import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import ChangePwd from "../../components/ChangePwd/ChangePwd";
import ErrorAlert from "../../components/form/ErrorAlert";
import Link from "next/link";
import Spinner from "../../components/Ui/Spinner";

const ChangePasswordFromEmail = () => {
	const router = useRouter();
	const { token } = router.query as { token: string };

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isValidToken, setIsValidToken] = useState<boolean>(false);
	const [userId, setUserId] = useState<string>("");
	const [success, setSuccess] = useState<boolean>(false);

	useEffect(() => {
		if (token) {
			const verifyToken = async () => {
				try {
					const verifiedTkn = await (
						await axios.post("/api/verify_tkn", { token })
					).data;
					console.log("from client", verifiedTkn);
					setUserId(verifiedTkn.userId);
					setIsValidToken(true);
				} catch (error) {
					console.log(error);
					setIsValidToken(false);
				}
				setIsLoading(false);
			};
			verifyToken();
		}
	}, [token]);

	const handleSuccess = () => {
		setSuccess(true);
		setTimeout(() => {
			router.push("/login");
		}, 2000);
	};

	const content = isValidToken ? (
		<>
			<h4 className="reset-password__logout--title">Reset password</h4>
			<ChangePwd userId={userId} theme="dark" onSuccess={handleSuccess} />
		</>
	) : (
		<>
			<ErrorAlert
				title={"Token error"}
				text={
					"Token non valido o scaduto. Richiedi un nuovo link per cambiare password."
				}
			/>
			<Link
				className="form__input--link reset-password__new-request"
				href={"/forgot-password"}
			>
				Richiedi un nuovo cambio password
			</Link>
		</>
	);

	return (
		<div className="loginContainer">
			<div className="loginModal">
				{isLoading ? (
					<Spinner />
				) : success ? (
					<>
						<ErrorAlert
							title={"Password cambiata correttamente!"}
							text={
								"Ti stiamo reindirizzando alla pagina di login."
							}
							isValidate={true}
						/>
						<Spinner />
					</>
				) : (
					content
				)}
			</div>
		</div>
	);
};

export default ChangePasswordFromEmail;
