import '../styles/style.scss'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar'
import { getSession, SessionProvider } from 'next-auth/react'
import { GetServerSideProps } from 'next'

export default function App({ Component, pageProps }: AppProps) {
  console.log(Component.name)
  return ( 
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
  )
}