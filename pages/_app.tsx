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
  return ( 
    <SessionProvider session={pageProps.session}>
      <Navbar />
      <Component {...pageProps} /> 
    </SessionProvider >
  )
}
