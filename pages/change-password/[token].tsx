import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import axios from "axios"
import ChangePwd from "../../components/ChangePwd/ChangePwd"

const ChangePasswordFromEmail = () => {
  const router = useRouter()
  const { token } = router.query as { token: string }

  const [ isValidToken, setIsValidToken ] = useState(false)
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

  return (
    <div>
      {isValidToken ? (
        <ChangePwd userId={userId}/>
      ) : (
        <p>Invalid or expired token. Please request a new reset link.</p>
      )}
    </div>
  )
}

export default ChangePasswordFromEmail