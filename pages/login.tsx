import { FormEventHandler, useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

// Components
import ErrorAlert from '../components/login/ErrorAlert'
import LoginForm from '../components/login/LoginForm'
import Logo from "../components/Ui/Logo";
import Spinner from "../components/Ui/Spinner"
import { AUTH_OK } from "../_shared"

function Login() {

	const [userInfo, setUserInfo] = useState<{email:string, password:string}>({ email: "", password: "" })
	const [loginError, setLoginError] = useState<boolean>(false)
	const [loadingLogin, setLoadingLogin] = useState<boolean>(false)
	const [enterFromLogin, setEnterFromLogin] = useState<boolean>(false)

	const router = useRouter()
	const session = useSession()


	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		setEnterFromLogin(true)
		setLoadingLogin(true)
		setLoginError(false)


		const res = await signIn("credentials", {
			email: userInfo.email,
			password: userInfo.password,
			redirect: false
		})


		const urlToEncode: string | undefined = res?.url?.split('callbackUrl=')[1]

		if (res && res!.error) {
			setLoginError(true)
			setLoadingLogin(false)
		}

		else urlToEncode
			? router.push(decodeURIComponent(urlToEncode))
			: router.push('/prenota')
	}

	if (session.status === AUTH_OK && !enterFromLogin) {
		router.push('/prenota')
		return
	}

	let loginForm

	if (session.status === 'loading') {
		loginForm = <Spinner />
	} else {
		loginForm = <LoginForm
			handleSubmit={handleSubmit}
			setUserInfo={setUserInfo}
			userInfo={userInfo}
			isLoading={loadingLogin}
		/>
	}
	return (
		<div className="loginContainer">
			<div className="loginModal">
				<Logo />
				{loginError &&
					<ErrorAlert
						title={'Credenziali non valide'}
						text={'Inserisci username e password corretti'}
					/>
				}
				{loginForm}
			</div>
		</div>
	)
}

export default Login
