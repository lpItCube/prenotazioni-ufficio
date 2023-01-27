import '../styles/style.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar/navbar'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

// Redux
import { store } from '../app/store'
import { Provider } from 'react-redux'

// Components
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {

  const [appIsLoading, setAppIsLoading] = useState(false)
  const [hitNotification, setHitNotification] = useState(false)

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        {
          Component.name !== "Login" ?
            <>
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
            </>
            : <Component {...pageProps} />
        }
      </Provider>
    </SessionProvider >
  )
}