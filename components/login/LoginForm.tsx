// Components
import Input from "./Input"
import { CiLogin } from "react-icons/ci";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import Button from "../Ui/Button";
import { Colors } from "../Ui/Colors";
import Spinner from "../Ui/Spinner";
import Link from "next/link";

type LoginProps = {
    handleSubmit:any,
    setUserInfo:any,
    userInfo:any,
    isLoading:boolean
}

function LoginForm({
    handleSubmit,
    setUserInfo,
    userInfo,
    isLoading
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
                <Link href={"/forgot-password"}>Password dimenticata?</Link>
            </div>
            {isLoading 
                ? <Spinner/>
                : <Button
                    onClick={() => console.log('Login')}
                    className='cta cta--primary cta__icon--right'
                    type='submit'
                    icon={<CiLogin size={24}/>}
                    text={'Login'}
                />
            }
            
        </form>
    )
}

export default LoginForm