// Hooks
import { useAuthHook } from "../../hooks/useAuthHook"

interface UserProps {
    icon: any 
}

const User: React.FC<UserProps> = (props): JSX.Element => {

    const { icon } = props
    const { userData } = useAuthHook()

    return (
        <div className="user__container">
            <div className="user__image">
                {icon}
            </div>
            <div className="user__name">
                <p className="user__label extra-min uppercase ls-1">
                    You are logged as:
                </p>
                <h2 
                    className="txt-h6"
                >
                    {userData.name}
                </h2>
            </div>
        </div>
    )
}

export default User