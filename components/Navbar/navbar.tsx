import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleNavbar, getNavbarStatus } from '../../features/navigationSlice'

// Components
import Logo from '../Ui/Logo'
import User from './UserOptions'
import { AiOutlineUser } from "react-icons/ai";
import Navigation from './Navigation'
import { Colors } from '../Ui/Colors'


function Navbar() {

  const dispatch = useDispatch()
  const navbarStatus = useSelector(getNavbarStatus)

  const session = useSession()

  const handleOpenNavbar = () => {
    dispatch(toggleNavbar(!navbarStatus))
  }

  return (
    <div className="navbar">
      <Logo />
      <User
        session={session}
        icon={<AiOutlineUser size={20} color={Colors.dark500} className='icon' />}
      />
      <Navigation />
      <a
        onClick={() => handleOpenNavbar()}
        href="#"
        className={`toggle-button${navbarStatus ? ' active' : ''}`}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </a>
    </div>
  )
}

export default Navbar
