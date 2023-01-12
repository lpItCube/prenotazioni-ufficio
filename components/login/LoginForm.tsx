// Components
import Input from "./Input"
import { CiLogin } from "react-icons/ci";
import { IoLockClosedOutline } from 'react-icons/io5'
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import Button from "../Ui/Button";
import { Colors } from "../Ui/Colors";

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
                    icon={<AiOutlineLock size={24} color={Colors.light700}/>}
                    handleInfo={handleEmail}
                    type='text'
                    placeholder='Username or Email'
                    name='uname'
                    required={true}
                />
                <Input
                    icon={<AiOutlineUser size={24} color={Colors.light700}/>}
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
        </form>
    )
}

export default LoginForm