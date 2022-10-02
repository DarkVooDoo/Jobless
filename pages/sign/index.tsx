
import {NextPage} from 'next'
import Head from 'next/head'

import { useState } from 'react'

import SigninForm from 'components/SigninForm'
import SignupForm from 'components/SignupForm'

import styles from "styles/Login.module.css"

const Sign:NextPage = ({ })=>{

    const [isSignup, setIsSignup] = useState(false)

    const onSignStateChange = ()=>{
        setIsSignup(prev=>!prev)
    }

    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <div className={styles.wrapper}>
                {isSignup ? <SignupForm {...{onSignStateChange}} /> : <SigninForm {...{onSignStateChange}} />}
            </div>

        </>
    )
}

export default Sign