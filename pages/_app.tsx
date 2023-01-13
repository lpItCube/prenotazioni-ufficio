import '../styles/style.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar/navbar'
import { getSession, SessionProvider } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import { store } from '../app/store'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
  console.log(Component.name)
  return ( 
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        {
          Component.name !== "Login" ?
          <div className="main-container">
            <Navbar />
            <Component {...pageProps} /> 
          </div> :
          <Component {...pageProps} /> 
        }
      </SessionProvider >
    </Provider>
  )
}