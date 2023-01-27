import axios from "axios"
import CustomLink from "./CustomLink"
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

// Components
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5"
import { BsJournalCheck } from "react-icons/bs";

import { TbDoorExit } from "react-icons/tb"
import { Colors } from "../Ui/Colors";
import Logout from "./Logout";

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { getNavbarStatus } from '../../features/navigationSlice'
import { getPendingNotification, setPendingNotification } from "../../features/notificationSlice"

// Hooks
import { useAuthHook } from '../../hooks/useAuthHook'

function Navigation({
    hitNotification,
    setHitNotification
  }: any) {

    const { userData } = useAuthHook()
    const navbarStatus: boolean = useSelector(getNavbarStatus)
    const userRole: string = userData.role
    const session = useSession()
    const dispatch = useDispatch()
    const pendingNotification = useSelector(getPendingNotification)
    const [pendingNotif, setPendingNotif] = useState(pendingNotification)
    const [hitLogout, setHitLogout] = useState(false)

    useEffect(() => {
        const getReserves = async () => {
            const response = await axios.get(`/api/reserve/pending`)
            dispatch(setPendingNotification({pending:response.data.length}))
        }
        if (session.status === "authenticated")
            getReserves()
    }, [session])

    useEffect(() => {
        setPendingNotif(pendingNotification)
        if(hitNotification) {
            setPendingNotif(pendingNotification)
            setHitNotification(false)
        }
    }, [pendingNotification, session, hitNotification])

    const path = useRouter().pathname

    const handleLogout = () => {
        setHitLogout(true)
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
                        notification={false}
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
                        notification={false}
                        icon={
                            <BsJournalCheck
                                size={18}
                                color={path.includes('prenotazioni') ? Colors.dark700 : Colors.light500}
                            />}
                        text="Prenotazioni"
                        isActive={path.includes('prenotazioni')}
                    />
                    {userRole === 'ADMIN' && path.includes('prenotazioni') &&
                        <ul
                            className="navigation__children"
                        >
                            <CustomLink
                                href="/prenotazioni"
                                text="Tutte le prenotazioni"
                                isActive={path === '/prenotazioni'}
                                notification={false}
                            />
                            <CustomLink
                                href="/prenotazioni/pending"
                                text="Da approvare"
                                notification={pendingNotif}
                                isActive={path.includes('prenotazioni') && path.includes('pending')}
                            />
                        </ul>
                    }


                    <CustomLink
                        href="/profilo"
                        notification={false}
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
                hitLogout={hitLogout}
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