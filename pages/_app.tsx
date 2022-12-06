import '../styles/globals.css'
import '../styles/first-office.css'
import '../styles/modal.css'
import '../styles/table.css'
import '../styles/login.css'
import '../styles/calendar.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar'

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <>
      <Navbar />
      <Component {...pageProps} /> 
    </>
  )
}