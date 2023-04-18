import { useEffect } from 'react'

// Next
import { useRouter } from 'next/router'

// Redux
import { useDispatch } from 'react-redux'
import { toggleNavbar } from '../../features/navigationSlice'


import Link from 'next/link'

interface CustomLinkProps {
    href: string,
    icon: any,
    text: string,
    isActive: boolean,
    notification: number | boolean | string
}

const CustomLink: React.FC<CustomLinkProps> = (props): JSX.Element => {

    const { href, icon, text,isActive, notification } = props 

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
                {notification as number > 0 && 
                    <p
                        className={'navigation__link--notification'}
                    >{notification}</p>
                }
            </Link>
        </li>
    )
}

export default CustomLink