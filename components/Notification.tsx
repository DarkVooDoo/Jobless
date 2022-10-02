import React, { CSSProperties, useEffect, useRef } from 'react'
import { NotificationTypes } from 'utils/types'
interface NotificationProps extends NotificationTypes {
    onNotificationEnded: ()=>void
}
const Notification:React.FC<NotificationProps> = ({message, isSuccess, onNotificationEnded })=>{
    const notificationBoxRef = useRef<HTMLDivElement>(null)
    const durationRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        const durationElement = durationRef.current
        const notificationElement = notificationBoxRef.current
        if(durationElement && notificationElement){
            notificationElement.animate([{opacity: "0"}, {opacity: "1"}], {duration: 300})
            durationElement.animate([{width: "100%", }, {width: "0%"}], {duration: 2000, delay: 300}).onfinish = ()=>{
                onNotificationEnded()
            }
        }
    },[])

    return (
        <div style={styles.notification} ref={notificationBoxRef}>
            <p style={styles.notification_message}>{message} </p>
            <div style={{...styles.notification_duration, backgroundColor: `${isSuccess ? "var(--Success-Color)": "var(--Warning-Color)"}`}} ref={durationRef} />
        </div>

    )
}

const styles: {[key: string]: CSSProperties} = {
    notification:{
        position: "absolute",
        right: "1rem",
        top: "5rem",
        height: "max-content",
        width: "15rem",
        borderRadius: "10px",
        backgroundColor: "white",
        zIndex: 100,
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
        overflow: "hidden"
    },
    notification_duration:{
        height: "5px"
    },
    notification_message:{
        padding: ".5rem",
        textAlign: "center"
    }
}

export default Notification