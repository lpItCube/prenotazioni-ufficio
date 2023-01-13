import { FormEventHandler, useState } from "react"
import { getSession, signIn } from "next-auth/react"
import Router from "next/router"
import { url } from "inspector"

// Icons
import { CiLock } from "react-icons/ci";

// Components
import ErrorAlert from '../components/Login/ErrorAlert'
import LoginForm from "../components/Login/LoginForm";
import Logo from "../components/Ui/Logo";

function Login() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    setLoginError(false)

    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    })

    if (res!.error) {
      setLoginError(true)
      console.log("Credenziali errate")
    }

    else window.location.replace("/prenota")
  }

  console.log(loginError)

  return (
    <div className="loginContainer">
      <div className="loginModal">
        <Logo/>
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
        />
        {/* <form onSubmit={handleSubmit}>
          <div className="content-input">
            <img src="user.gif" />
            <input
              type="text"
              placeholder="Username or Email"
              name="uname"
              onChange={({ target }) => {
                setUserInfo({ ...userInfo, email: target.value })
              }}
              required
            />
          </div>
          <div className="content-input">
            <img src="lock.png" />
            <input
              type="password"
              placeholder="Password"
              name="psw"
              onChange={({ target }) => {
                setUserInfo({ ...userInfo, password: target.value })
              }}
              required />
          </div>
          <button className="login-btn" type="submit" > <span> Login </span>  <img src="enter.png" /> </button>
        </form> */}
      </div>
    </div>
  )
}

export default Login
