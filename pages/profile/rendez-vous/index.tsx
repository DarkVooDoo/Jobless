import WebRTC from 'controllers/WebRTC.controller'
import {GetStaticProps, NextPage} from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { useContext, useEffect, useState } from 'react'
import { UserContext } from 'utils/contexts'

interface AppointementProps {
    
}
const Appointement:NextPage<AppointementProps> = ({ })=>{
    const [user] = useContext(UserContext)

    const [RTC, setRTC] = useState<WebRTC | undefined>(undefined)
    const [appoints, setAppoints] = useState<{appointement_date: string, appointement_id: string}[]>([])

    useEffect(()=>{
        (async ()=>{
            if(!user) return
            try{
                const fetchAppointements = await fetch(`/api/appointement?userId=${user?.id}`)
                const appointements = await fetchAppointements.json() as {appointement_date: string, appointement_id: string}[]
                setAppoints(appointements)
            }catch(err){}
        })()
    },[user])

    useEffect(()=>{
        if(!user) return
        setRTC(new WebRTC(user.id))
    },[user])

    const appointements = appoints.map(item=>(
        <Link key={item.appointement_id} href={`/profile/rendez-vous/${item.appointement_id}`}> 
            <p>{item.appointement_id}</p>
        </Link>
    ))
    return (
        <>
            <Head>
                
            </Head>
            <div>
                <h1>Create CV</h1>
                <button onClick={()=>RTC && RTC.createAppointement()}>Creer Entretien</button>
                {appointements}
            </div>

        </>
    )
}

export const getStaticProps:GetStaticProps = async ()=>{

    return {props:{}}
}

export default Appointement
 
    //About me
    //Formation
    //Experience Proffessionnels
    //Langues: {niveau: "Moyen" | "Bilangue", langue: string}[]