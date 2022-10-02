import React, { useContext, useEffect, useState } from 'react'

import Link from 'next/link'
import Image from 'next/future/image'
import { useRouter } from 'next/router'

import avatar from "public/user.png"

import { ROUTES_PATHS, UserContext } from 'utils/contexts'

import styles from 'styles/Navbar.module.css'


const Navbar:React.FC= ({ })=>{
    const router = useRouter()
    const [user] = useContext(UserContext)

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        }, 1000)
    }, [])

    const isSignIn = user ? <Image className={styles.navbar_right_photo} src={avatar} alt="avatar" onClick={()=>router.push(ROUTES_PATHS.profile)} />
    : <button className={styles.navbar_right_signBtn} onClick={()=>router.push(ROUTES_PATHS.sign)}>Sign In</button>

    if(!loading){
        return (
            <div className={styles.navbar}>
                <div className={styles.navbar_logo}>
                    <Link href={ROUTES_PATHS.home}>Home</Link>
                </div>
                <div className={styles.navbar_right}>
                    {isSignIn}
                </div>
            </div>
    
        )
    }
    return (
        <div className={styles.navbar}>
            <div className={styles.navbar_loadingHome} />
            <div className={styles.navbar_right}>
                <div className={styles.navbar_right_photo} />
            </div>
        </div>

    )
    
}

export default Navbar