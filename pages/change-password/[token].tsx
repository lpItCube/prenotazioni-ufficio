import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import axios from "axios"

function ChangePassword() {
  const router = useRouter()
  const { token } = router.query as { token: string }

  const [ isValidToken, setIsValidToken ] = useState(false)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [userId, setUserId] = useState('')

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const verifiedTkn = await (await axios.post('/api/verify_tkn', { token })).data
          console.log("from client", verifiedTkn)
          setUserId(verifiedTkn.userId)
          setIsValidToken(true)
        } catch (error) {
          console.log(error)
          setIsValidToken(false)
        }
      }
      verifyToken()
    }
    
  }, [token])

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Password do not match')
      return
    }
    try {
      await axios.post('/api/change_pwd', { userId, newPassword }) 
    } catch (error) {
      console.log(error)
    }
    setPasswordChanged(true)
  }

  return (
    <div>
      {isValidToken ? (
        <div>
          <h3>Reset Your Password</h3>
          {passwordChanged ? (
            <p>Password successfully changed!</p>
          ) : (
            <div>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button onClick={handlePasswordChange}>Change Password</button>
            </div>
          )}
        </div>
      ) : (
        <p>Invalid or expired token. Please request a new reset link.</p>
      )}
    </div>
  )
}

export default ChangePassword