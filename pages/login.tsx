import { FormEventHandler, useState } from "react"
import { signIn } from "next-auth/react"

// Components
import ErrorAlert from '../components/Login/ErrorAlert'
import LoginForm from "../components/Login/LoginForm";
import Logo from "../components/Ui/Logo";

function Login() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    setLoadingLogin(true)
    setLoginError(false)

    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    })

    if (res!.error) {
      setLoginError(true)
      console.log("Credenziali errate")
      setLoadingLogin(false)
    }

    else window.location.replace("/prenota")
  }

  console.log(loginError)

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
        <LoginForm
          handleSubmit={handleSubmit}
          setUserInfo={setUserInfo}
          userInfo={userInfo}
          isLoading={loadingLogin}
        />
      </div>
    </div>
  )
}

export default Login
