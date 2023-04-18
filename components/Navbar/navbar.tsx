// Next
import { useSession } from 'next-auth/react'

// Components
import Logo from '../Ui/Logo'
import User from './UserOptions'
import Navigation from './Navigation'
import { Colors } from '../Ui/Colors'

// Icons
import { AiOutlineUser } from "react-icons/ai";

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleNavbar, getNavbarStatus } from '../../features/navigationSlice'


interface NavbarProps {
	hitNotification: boolean,
	setHitNotification: (nots: boolean) => void
}

const Navbar: React.FC<NavbarProps> = (props): JSX.Element => {

	const { hitNotification, setHitNotification } = props

	const dispatch = useDispatch()
	const session = useSession()
	const navbarStatus = useSelector(getNavbarStatus)

	const handleOpenNavbar = () => {
		dispatch(toggleNavbar(!navbarStatus))
	}

	return (
		<>
			<div className={`navbar${navbarStatus ? ' active' : ''}`}>
				<Logo />
				<User
					icon={<AiOutlineUser size={20} color={Colors.dark500} className='icon' />}
				/>
				<Navigation
					hitNotification={hitNotification}
					setHitNotification={setHitNotification}
				/>
			</div>
			<div onClick={() => handleOpenNavbar()} className={`navbar-obscurer${navbarStatus ? ' active' : ''}`}></div>
		</>
	)
}

export default Navbar
