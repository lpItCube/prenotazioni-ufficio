import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleNavbar, getNavbarStatus } from '../../features/navigationSlice'


import Link from 'next/link'

function CustomLink({ 
    href, 
    icon, 
    text,
    isActive
}: any) {

    const dispatch = useDispatch()

    const path = useRouter().pathname

    useEffect(() => {
        dispatch(toggleNavbar(false))
    }, [path])
    
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