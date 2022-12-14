import '../styles/globals.css'
import '../styles/first-office.css'
import '../styles/modal.css'
import '../styles/table.css'
import '../styles/login.css'
import '../styles/calendar.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar'
import { SessionProvider } from 'next-auth/react'

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
