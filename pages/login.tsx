function Login() {
  return (
    <div className="loginContainer">
      <div className="loginModal">
        <form>
          <input type="text" placeholder="Username or Email" name="uname" required></input>
          <input type="password" placeholder="Password" name="psw" required></input>
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login  