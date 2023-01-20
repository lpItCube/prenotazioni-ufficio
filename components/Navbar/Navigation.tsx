import CustomLink from "./CustomLink"
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

// Components
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5"
import { BsJournalCheck } from "react-icons/bs";

import { TbDoorExit } from "react-icons/tb"
import { Colors } from "../Ui/Colors";
import Logout from "./Logout";

// Redux
import { useSelector } from 'react-redux'
import { getNavbarStatus } from '../../features/navigationSlice'


function Navigation() {

    const navbarStatus:boolean = useSelector(getNavbarStatus)

    const path = useRouter().pathname

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' })
    }

    return (
        <nav className={`navigation__container${navbarStatus ? ' active' : ''}`}>
            <div className="navigation__wrapper">
                <p className="navigation__label extra-min uppercase ls-1">
                    Menu:
                </p>
                <ul>
                    <CustomLink
                        href="/prenota"
                        icon={
                            <IoCalendarOutline
                                size={18}
                                color={path === '/prenota' ? Colors.dark700 : Colors.light500}
                            />}
                        text="Prenota"
                        isActive={path === '/prenota'}
                    />
                    <CustomLink
                        href="/prenotazioni"
                        icon={
                            <BsJournalCheck
                                size={18}
                                color={path === '/prenotazioni' ? Colors.dark700 : Colors.light500}
                            />}
                        text="Prenotazioni"
                        isActive={path === '/prenotazioni'}
                    />
                    <CustomLink
                        href="/profilo"
                        icon={
                            <IoSettingsOutline
                                size={18}
                                color={path === '/profilo' ? Colors.dark700 : Colors.light500}
                            />}
                        text="Profilo"
                        isActive={path === '/profilo'}
                    />
                </ul>
            </div>
            <Logout
                handleLogout={handleLogout}
                icon={
                    <TbDoorExit
                        size={24}
                        color={Colors.light500}
                    />
                }
                text='Logout'
            />
        </nav>
    )
}

export default Navigation