import { FormEventHandler, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// Components
import Logo from "../components/Ui/Logo";
import Spinner from "../components/Ui/Spinner";
import { AUTH_OK } from "../_shared";
import Form from "../components/form/Form";
import { getLoginLayout } from "../utils/layout";
import ErrorAlert from "../components/form/ErrorAlert";

function Login() {
	const [userInfo, setUserInfo] = useState<{
		email: string;
		password: string;
	}>({ email: "", password: "" });
	const [loginError, setLoginError] = useState<boolean>(false);
	const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
	const [enterFromLogin, setEnterFromLogin] = useState<boolean>(false);

	const router = useRouter();
	const session = useSession();

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		setEnterFromLogin(true);
		setLoadingLogin(true);
		setLoginError(false);

		const res = await signIn("credentials", {
			email: userInfo.email,
			password: userInfo.password,
			redirect: false,
		});

		// const urlToEncode: string | undefined = res?.url?.split('callbackUrl=')[1]

		if (res && res!.error) {
			setLoginError(true);
			setLoadingLogin(false);
		}

		// REMOVED BECAUSE WORK BAD ON VERCEL
		// else urlToEncode
		// 	? router.push(decodeURIComponent(urlToEncode))
		// 	: router.push('/prenota')
		else {
			router.push("/prenota");
		}
	};

	if (session.status === AUTH_OK && !enterFromLogin) {
		router.push("/prenota");
		return;
	}

	const handleEmail = (e: any) => {
		setUserInfo({ ...userInfo, email: e.target.value });
	};

	const handlePassword = (e: any) => {
		setUserInfo({ ...userInfo, password: e.target.value });
	};

	const handleLogin = () => {};

	const layout = getLoginLayout(
		handleEmail,
		"Username or Email",
		"uname",
		handlePassword,
		"Password",
		"password",
		"cta cta--primary cta__icon--right",
		handleLogin,
		userInfo.email,
		userInfo.password
	);

	let loginForm;

	if (session.status === "loading") {
		loginForm = <Spinner />;
	} else {
		loginForm = (
			<Form
				{...layout}
				handleSubmit={handleSubmit}
				isLoading={loadingLogin}
				isLogin={true}
				theme="dark"
			/>
		);
	}
	return (
		<div className="loginContainer">
			<div className="loginModal">
				<Logo />
				{loginError && (
					<ErrorAlert
						title={"Credenziali non valide"}
						text={"Inserisci username e password corretti"}
					/>
				)}
				{loginForm}
			</div>
		</div>
	);
}

export default Login;
