import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

// Components
import Logo from '../Ui/Logo'
import User from './UserOptions'
import { AiOutlineUser } from "react-icons/ai";
import Navigation from './Navigation'
import { Colors } from '../Ui/Colors'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleNavbar, getNavbarStatus } from '../../features/navigationSlice'

function Navbar({
  hitNotification,
  setHitNotification
}: any) {

  const dispatch = useDispatch()
  const navbarStatus: boolean = useSelector(getNavbarStatus)

  const session = useSession()

  const handleOpenNavbar = () => {
    dispatch(toggleNavbar(!navbarStatus))
  }

  return (
    <>
      <div className={`navbar${navbarStatus ? ' active' : ''}`}>
        <Logo />
        <User
          session={session}
          icon={<AiOutlineUser size={20} color={Colors.dark500} className='icon' />}
        />
        <Navigation 
          hitNotification={hitNotification} 
          setHitNotification={setHitNotification}
        />
      </div>
      <div onClick={() => handleOpenNavbar()}className={`navbar-obscurer${navbarStatus ? ' active' : ''}`}></div>
    </>
  )
}

export default Navbar
