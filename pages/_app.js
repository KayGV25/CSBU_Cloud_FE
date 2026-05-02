import { Toaster } from 'sonner'
import UserContextProvider from '../context/UserContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Component {...pageProps}/>
      <Toaster richColors/>
    </UserContextProvider>
  )
}

export default MyApp
