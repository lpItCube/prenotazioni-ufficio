import { signOut } from 'next-auth/react'

// Components
import Logo from './Ui/Logo'
import { TbDoorExit } from "react-icons/tb"
import { Colors } from './Ui/Colors'
import Button from './Ui/Button'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleNavbar, getNavbarStatus } from '../features/navigationSlice'

function Header() {

    const dispatch = useDispatch()
    const navbarStatus:boolean = useSelector(getNavbarStatus)

    const handleOpenNavbar = () => {
        dispatch(toggleNavbar(!navbarStatus))
    }

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' })
    }

    
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
                <Logo/>
            </div>
            <div className='main-header__logout'>
                <Button
                    onClick={() => handleLogout()}
                    className='cta cta--primary cta__icon--right'
                    type='submit'
                    icon={<TbDoorExit size={20}/>}
                    text=''
                />
            </div>
        </header>
    )
}

export default Header
