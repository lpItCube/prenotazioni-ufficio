import Link from 'next/link'

function Logout({ 
    handleLogout,
    icon, 
    text
}: any) {
    
    return (
        <div 
            onClick={() => handleLogout()}
            className='navigation__logout'
        >
            {icon}
            <p
                className="navigation__logout--text min"
            >
                {text}
            </p>
        </div>
    )
}

export default Logout