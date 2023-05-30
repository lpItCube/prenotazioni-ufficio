import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

// Components
import Logo from './Ui/Logo'
import { TbDoorExit } from "react-icons/tb"
import Button from './Ui/Button'

// Hooks
import { useAuthHook } from '../hooks/useAuthHook'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleNavbar, getNavbarStatus } from '../features/navigationSlice'

type HeaderProps = {
    setAppIsLoading:any
}

function Header({
    setAppIsLoading
}: HeaderProps ) {

    const dispatch = useDispatch()
    const navbarStatus: boolean = useSelector(getNavbarStatus)

    const { roleLoading } = useAuthHook()

    const handleOpenNavbar = () => {
        dispatch(toggleNavbar(!navbarStatus))
    }

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' })
    }

    useEffect(() => {
        setAppIsLoading(roleLoading)
    }, [roleLoading, setAppIsLoading])

    return (
        <header
            className='main-header'
        >
            <div className='main-header__primary'>
                <a
                    onClick={() => handleOpenNavbar()}
                    href="#"
                    className={`menu-button${navbarStatus ? ' active' : ''}`}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </a>
                <Logo />
            </div>
            <div className='main-header__logout'>
                <Button
                    onClick={() => handleLogout()}
                    className='cta cta--primary cta__icon--right'
                    type='submit'
                    icon={<TbDoorExit size={20} />}
                    text=''
                />
            </div>
        </header>
    )
}

export default Header
