import '../styles/style.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar/navbar'
import { getSession, SessionProvider } from 'next-auth/react'
import { GetServerSideProps } from 'next'

// Redux
import { store } from '../app/store'
import { Provider } from 'react-redux'

// Components
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  console.log(Component.name)
  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        {
          Component.name !== "Login" ?
            <>
              <Header />
              <div className="main-container">
                <Navbar />
                <div className="resAndCalContainer">
                  <Component {...pageProps} />
                </div>
              </div>
            </>
            : <Component {...pageProps} />
        }
      </SessionProvider >
    </Provider>
  )
}