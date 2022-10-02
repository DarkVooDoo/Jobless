import {NextPage} from 'next'
import Head from 'next/head'

import {useRef, useContext, useState, useEffect} from 'react'

import WebRTC from 'controllers/WebRTC.controller'

import styles from 'styles/Cv.module.css'

import { UserContext } from 'utils/contexts'
import { useRouter } from 'next/router'
import { CallUserValuesTypes, UserTypes } from 'pages/api/appointement/[id]'

interface VideoCallProps {
    
}
const VideoCall:NextPage<VideoCallProps> = ({ })=>{
    const router = useRouter()
    const [user] = useContext(UserContext)
    const remoteUserCameraRef = useRef<HTMLVideoElement>(null)
    const myCameraRef = useRef<HTMLVideoElement>(null)

    const [RTC, setRTC] = useState<WebRTC | undefined>(undefined)

    const onJoinCall = async ()=>{
        if(!RTC) return
        await fetch(`/api/appointement/${router.query.id}`)
        const websocket = new WebSocket("ws://localhost:1234")
        websocket.onopen  = (ev)=>{
            // websocket.send(JSON.stringify({name: "Moises", age: 22}))
        }
        websocket.onmessage = async (ev)=>{
            const data:CallUserValuesTypes[] = JSON.parse(ev.data)
            RTC.allSessions = data
            const remoteOffer = data.find(item=>item.user_id !== user?.id)
            const state = await RTC.getConnectionState()
            if(state !== "complete") {
                RTC.starCall()
                return
            }else if(remoteOffer?.candidate_session){
                console.log(`My ID: ${user?.id}`)
                console.log(data)
                console.log(`Adding remoteDescription to Offer ${remoteOffer?.candidate_session}`)
                RTC.addRemoteDescription(remoteOffer?.candidate_session!)
            }
            

            
        }
        // websocket.send("")
    }

    useEffect(()=>{
        const roomId = router.query.id
        if(!remoteUserCameraRef.current || !myCameraRef.current || !user || !roomId) return
        setRTC(new WebRTC(user.id, roomId.toString(), remoteUserCameraRef.current, myCameraRef.current))
    },[user])
    return (
        <>
            <Head>
                
            </Head>
                <button onClick={onJoinCall}>Join Call</button>
                <div className={styles.cameras_container}>
                    <video autoPlay ref={remoteUserCameraRef} className={styles.cameras_container_remoteUser} />
                    <video autoPlay ref={myCameraRef} muted className={styles.cameras_container_myCamera} />
            </div>

        </>
    )
}

export default VideoCall