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

function Navbar() {

  const session = useSession()

  const [navbarOpen, setNavbarOpen] = useState<Boolean>(false)

  const handleOpenNavbar = () => {
    setNavbarOpen(prev => !prev)
  }

  return (
    <div className="navbar">
      <Logo/>
      <User
        session={session}
        icon={<AiOutlineUser size={20} color={Colors.dark500} className='icon'/>}
      />
      <Navigation
        navbarOpen={navbarOpen}
      />
      <a
        onClick={() => handleOpenNavbar()}
        href="#"
        className={`toggle-button${navbarOpen ? ' active' : ''}`}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </a>
    </div>
  )
}

export default Navbar
