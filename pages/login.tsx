import { FormEventHandler, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

// Components
import ErrorAlert from '../components/login/ErrorAlert'
import LoginForm from '../components/login/LoginForm'
import Logo from "../components/Ui/Logo";
import Spinner from "../components/Ui/Spinner"

function Login() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [enterFromLogin, setEnterFromLogin] = useState(false)

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


    const urlToEncode:any = res?.url?.split('callbackUrl=')[1]

    if (res && res!.error) {
      setLoginError(true)
    }
    
    else urlToEncode
    ? router.push(decodeURIComponent(urlToEncode))
    : router.push('/prenota')
    
    setLoadingLogin(false)
  }
  
  if(session.status === 'loading') {
    return <Spinner/>
  }

  if(session.status === 'authenticated' && !enterFromLogin) {
    router.push('/prenota')
    return
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
