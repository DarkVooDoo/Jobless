import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'

import { UserContext } from 'utils/contexts' 
import { UserContextTypes } from 'models/User/User.types'

import Layout from '../components/Layout'

const MyApp = ({ Component, pageProps }: AppProps)=> {

  const [user, setUser] = useState<UserContextTypes | undefined>(undefined)
  
  const onUserChange = (user: UserContextTypes | undefined)=>{
    setUser(user)
  }

  return (
    <UserContext.Provider value={[user, onUserChange]}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  )
}


export default MyApp
