import { FormEventHandler, useState } from "react"
import { signIn } from "next-auth/react"
import Router from "next/router"

function Login() {
  const [userInfo, setUserInfo] = useState({ email: "", password: ""})

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    })

    console.log(res)

    if (res!.error) {
      const invalidLoginEl = document.getElementsByClassName("invalidLogin")[0];
      (invalidLoginEl as HTMLElement).style.display = "block"
      console.log("Credenziali errate")
    }
    
    else {
      Router.replace("/prenota")
    }
  }

  return (
    <div className="loginContainer">
      <div className="loginModal">
        <div className="invalidLogin">
          <p>Crendeziali non valide</p>
          <p>Inserisci username e password corretti</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username or Email" 
            name="uname" 
            onChange={({ target }) => {
              setUserInfo({ ...userInfo, email: target.value })
            }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="psw" 
            onChange={({ target }) => {
              setUserInfo({ ...userInfo, password: target.value })
            }}
            required />
          <button className="login-btn" type="submit" >Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login  