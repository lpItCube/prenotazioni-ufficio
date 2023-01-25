import { FormEventHandler, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

// Components
import ErrorAlert from '../components/login/ErrorAlert'
import LoginForm from '../components/login/LoginForm'
import Logo from "../components/Ui/Logo";

function Login() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)

  const router = useRouter()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    setLoadingLogin(true)
    setLoginError(false)

    
    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    })


    console.log('RESPONSE',res)

    if (res!.error) {
      setLoginError(true)
      // console.log("Credenziali errate")
      setLoadingLogin(false)
    }

    else router.push('/prenota')
  }

  // console.log(loginError)

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
