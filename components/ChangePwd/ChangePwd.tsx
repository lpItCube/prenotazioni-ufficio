import axios from "axios";
import { useState } from "react";

interface ChangePwdProps {
  userId: string
}

const ChangePwd : React.FC<ChangePwdProps> = (props) => {

  const { userId } = props;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

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
  )
}

export default ChangePwd;