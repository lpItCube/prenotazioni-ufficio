import axios from "axios"
import { useEffect, useState } from "react"
import { hashPwd } from "../../utils/hashPassword"

function ResetPassword () {
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState("null")
  const [resetError, setResetError] = useState("null")

  const handleForgot = async (e: any) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post('api/reset_pwd', {
        email: email
      })
      setResetSuccess(response.data.msg)
      setLoading(false)
      setResetError('')
    } catch (err: any) {
      setLoading(false)
      const { data } = err.response
      setResetError(data.msg)
      setResetSuccess("null")
    }
  }

  return (
    <div>
      {resetError && <div>EDDAI</div>}
      {resetSuccess && <div>UFFA</div>}
      <form onSubmit={handleForgot} className="reset-password">
        <h1>Forgot Password</h1>
        <p>You are not alone. We've all been here at some point.</p>
        <div>
          <label htmlFor="email">Email address</label>
          <input 
            type="email"
            name="email"
            id="email"
            placeholder="your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <button name="reset-pwd-button" className="reset-pwd">
          {!loading ? 'Get secure link' : 'Sending...'}
        </button>
      </form>
    </div>
  ) 
}

export default ResetPassword