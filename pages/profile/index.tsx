import {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/future/image'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { UserProfileTypes } from 'models/User/User.types'

import marker from 'public/marker.svg'
import mail from 'public/mail.svg'
import logout from 'public/logout.svg'
import cv from 'public/cv.svg'

import UserController from 'controllers/User.controller'

import styles from "styles/Profile.module.css"

import MyApplicationCard from 'components/MyApplicationCard'
import { ROUTES_PATHS } from 'utils/contexts'

const PROFILE_ACTIONS = [
    {
        icon: "",
        text: "Mon Compte"
    },
    {
        icon: "",
        text: "Creer Annonce"
    },
    {
        icon: "",
        text: "Desconnectez-vous",
    }
]
interface ProfileProps extends UserProfileTypes{
    
}
const Profile:NextPage<ProfileProps> = ({user_name, user_lastname, user_email, user_photo, user_city, user_role, applications })=>{
    const userController = new UserController()
    const router = useRouter()

    const myApplications = applications.map(item=><MyApplicationCard key={item.application_id} {...{...item}} />)
    //TODO:
    // Entreprise: 
    //     - Peuvent faire une creation d'emploi (Half)
    //     - Voir ses annonces
    // Users:
    //     - Voir ses applications (full width. carousel?)
    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <div>
                <div className={`${styles.profile_info} box_shadow`}>
                    <div className={styles.profile_info_photo} >
                        {user_photo ? <Image src={user_photo} alt="avatar" className={styles.profile_info_photo}/> : <div>{user_name[0]} {user_lastname[0]}</div>}
                    </div>
                    <div className={styles.profile_info_about}>
                        <h1 className={`${styles.profile_info_about_name} next_row_margin`}>{user_name} {user_lastname}</h1>
                        <div className={`${styles.profile_info_about_box}`}>
                            <Image src={mail} alt="mail" className={styles.profile_info_about_icon}/>
                            <p>{user_email} </p>
                        </div>
                        <div className={`${styles.profile_info_about_box}`}>
                            <Image src={marker} alt="marker" className={styles.profile_info_about_icon}/>
                            <p>{user_city} </p>
                        </div>
                    </div>
                </div>                
                <h1 className='next_row_margin'>Mes Derniers Postulation</h1>
                <div style={{display: "flex", flexWrap: "wrap", gap: "10%"}}>
                    {user_role === "User" ? myApplications : <Link href={`${ROUTES_PATHS.create_job}`}>Create Job</Link>}
                </div>
                <div>
                    <div className={`${styles.profile_action_row}`} onClick={()=>router.push(ROUTES_PATHS.account)}>
                        <b>Icon</b>
                        <p >Mon Compte</p>
                    </div>
                    {userController.user?.role === "User" && <div className={`${styles.profile_action_row}`} onClick={()=>router.push(ROUTES_PATHS.cv)}>
                        <b>Icon</b>
                        <p >Create CV</p>
                    </div>}
                    <div className={`${styles.profile_action_row}`} onClick={()=>userController.logout()}>
                        <Image src={logout} alt="logout" className={`${styles.profile_action_row_icon}`}/>
                        <p>Deconnetez-vous</p>
                    </div>
                </div>
            </div>

        </>
    )
}

export const getServerSideProps:GetServerSideProps = async ({req})=>{
    const myProfile = await fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000/api/user/1" : `${process.env.PROD_BASE_URL}/api/user/1`}`, {
        headers: [["Authorization-Token", req.cookies["Authorization-Token"] ?? ""]]
    })
    const profile = await myProfile.json()
     return {props: {...profile}}
}

export default Profile