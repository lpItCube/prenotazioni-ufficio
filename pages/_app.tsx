import '../styles/style.scss'
import { useState } from 'react'

// Next
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

// Redux
import { store } from '../app/store'
import { Provider } from 'react-redux'

// Components
import Navbar from '../components/Navbar/navbar'
import Header from '../components/Header'
import { MousePosition } from '../types'
import SeatPopup from '../components/Book/SeatPopup'
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {

	const [appIsLoading, setAppIsLoading] = useState<boolean>(false)
	const [hitNotification, setHitNotification] = useState<boolean>(false)
	const [cursorPos, setCursorPos] = useState<MousePosition>({ x: 0, y: 0 });

	const router = useRouter();
	const containsLogin = router.pathname.includes('login');
	const handleMouseMove = (e: any) => {
        setCursorPos({
            x: e.clientX,
            y: e.clientY 
        })
    }


	return (
		<SessionProvider session={pageProps.session}>
			<Provider store={store}>
				{
					!containsLogin ?
						<div>
							<SeatPopup
								cursorPos={cursorPos}
							/>
							<Header
								setAppIsLoading={setAppIsLoading}
							/>
							<div className="main-container">
								{appIsLoading
									? 'Loading ...'
									: <>
										<Navbar
											hitNotification={hitNotification}
											setHitNotification={setHitNotification}
										/>
										<div className="main-wrapper">
											<Component
												hitNotification={hitNotification}
												setHitNotification={setHitNotification}
												{...pageProps}
											/>
										</div>
									</>
								}
							</div>
						</div>
						: <Component {...pageProps} />
				}
			</Provider>
		</SessionProvider >
	)
}