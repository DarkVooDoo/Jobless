import React, { CSSProperties, useState } from 'react'

interface ModalProps {
    children: JSX.Element,
    state: boolean,
    onStateChange: (state: boolean)=> void
}
const Modal:React.FC<ModalProps> = ({children, state, onStateChange })=>{
    if(!state) return null
    return (
        <div style={styles.container}>
            <div style={styles.bg} onClick={()=>onStateChange(!state)} />
            <div style={styles.content}>
                {children}
            </div>
        </div>

    )
}

const styles:{[key:string]: CSSProperties} = {
    container:{
        zIndex: 1000,
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: "center",
        justifyContent: "center"
    },
    bg:{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "#363636a3",
        zIndex: 999
    },
    content:{
        zIndex: "inherit"
    }
}

export default Modal