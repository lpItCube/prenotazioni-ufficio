import { FormEventHandler, useState } from "react"
import { getSession, signIn } from "next-auth/react"
import Router from "next/router"
import { url } from "inspector"

function Login() {
  const [userInfo, setUserInfo] = useState({ email: "", password: ""})

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    })

    if (res!.error) {
      const invalidLoginEl = document.getElementsByClassName("invalidLogin")[0];
      (invalidLoginEl as HTMLElement).style.display = "block"
      console.log("Credenziali errate")
    }

    else window.location.replace("/prenota")
  }

  return (
    <div className="loginContainer">
      <div className="loginModal">

        <div className="contentlogo">
          <div className="logo">
            <div>
              <img src="logo.png"></img>
            </div>
          </div>
        </div>

        <div className="invalidLogin">
          <p>Crendeziali non valide</p>
          <p>Inserisci username e password corretti</p>
        </div>
        <form onSubmit={handleSubmit}>
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
        </form>
      </div>
    </div>
  )
}

export default Login
