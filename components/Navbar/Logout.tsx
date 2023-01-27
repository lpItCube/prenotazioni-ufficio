import Spinner from "../Ui/Spinner"

function Logout({
    hitLogout,
    handleLogout,
    icon,
    text
}: any) {

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