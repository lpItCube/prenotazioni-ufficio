// Components
import Input from "./Input"
import { CiLock, CiUser, CiLogin } from "react-icons/ci";
import Button from "../Ui/Button";

type LoginProps = {
    handleSubmit:any,
    setUserInfo:any,
    userInfo:any
}

function LoginForm({
    handleSubmit,
    setUserInfo,
    userInfo
}: LoginProps ) {

    const handleEmail = (target:any) => {
        setUserInfo({ ...userInfo, email: target.value })
    }

    const handlePassword = (target:any) => {
        setUserInfo({ ...userInfo, password: target.value })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form__input--wrapper">
                <Input
                    icon={<CiLock size={24} className='icon--light'/>}
                    handleInfo={handleEmail}
                    type='text'
                    placeholder='Username or Email'
                    name='uname'
                    required={true}
                />
                <Input
                    icon={<CiUser size={24} className='icon--light'/>}
                    handleInfo={handlePassword}
                    type='password'
                    placeholder='Password'
                    name='psw'
                    required={true}
                />
            </div>
            <Button
                className='cta cta--primary cta__icon--right'
                type='submit'
                icon={<CiLogin size={24}/>}
                text='Login'
            />
            {/* <button className="login-btn" type="submit" > 
            <span> Login </span>  
            <img src="enter.png" /> 
            </button> */}
        </form>
    )
}

export default LoginForm