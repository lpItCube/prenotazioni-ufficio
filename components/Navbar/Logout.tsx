// Components
import Spinner from "../Ui/Spinner"

interface LogoutProps {
    hitLogout: boolean,
    handleLogout: () => void,
    icon: any,
    text: string
}

const Logout: React.FC<LogoutProps> = (props): JSX.Element => {

    const { hitLogout, handleLogout, icon, text } = props

    return (
        <div
            onClick={() => handleLogout()}
            className='navigation__logout'
        >
            {hitLogout
                ? <Spinner />
                : icon
            }
            <p
                className="navigation__logout--text min"
            >
                {text}
            </p>

        </div>
    )
}

export default Logout