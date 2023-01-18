import '../styles/style.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar/navbar'
import { getSession, SessionProvider } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useState } from 'react'

// Redux
import { store } from '../app/store'
import { Provider } from 'react-redux'

// Components
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  // console.log(Component.name)

  const [appIsLoading, setAppIsLoading] = useState(false)

  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        {
          Component.name !== "Login" ?
            <>
              <Header 
                setAppIsLoading={setAppIsLoading}
              />
              <div className="main-container">
                { appIsLoading 
                  ? 'Loading ...'
                  : <>
                    <Navbar />
                    <div className="resAndCalContainer">
                      <Component {...pageProps} />
                    </div>
                  </>
                }
                
              </div>
            </>
            : <Component {...pageProps} />
        }
      </SessionProvider >
    </Provider>
  )
}