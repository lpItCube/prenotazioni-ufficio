import Link from 'next/link'

function CustomLink({ 
    href, 
    icon, 
    text,
    isActive
}: any) {
    
    return (
        <li 
            className={`navigation__item${isActive ? " active" : ""}`}
        >
            <Link 
                href={href}
                className="navigation__link"
            >
                {icon}
                <p
                    className="navigation__link--text min"
                >
                    {text}
                </p>
            </Link>
        </li>
    )
}

export default CustomLink