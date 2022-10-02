import React, { CSSProperties } from 'react'

const BUTTON_WIDTH = 3

interface ToggleButtonProps {
    state: boolean,
    onStateChange: (state: boolean)=>void
}
const ToggleButton:React.FC<ToggleButtonProps> = ({state, onStateChange })=>{
    return (
        <div style={{...styles.button, backgroundColor: state ? "var(--Primary-Color)" : "#e2e2e2"}}>
            <div style={{...styles.button_state, left: state ? `${BUTTON_WIDTH / 2}rem` : 0}} onClick={()=>onStateChange(!state)} />
        </div>

    )
}

const styles:{[key: string]: CSSProperties} = {
    button:{
        position: "relative",
        width: `${BUTTON_WIDTH}rem`,
        height: `${BUTTON_WIDTH / 2}rem`,
        borderRadius: "25px",
        outline: ".5px solid #e2e2e2",
        transition: "all .3s linear"
    },
    button_state:{
        position: "absolute",
        top: 0,
        borderRadius: "25px",
        width: `${BUTTON_WIDTH / 2}rem`,
        height: `${BUTTON_WIDTH / 2}rem`,
        backgroundColor: "white",
        transition: "all .3s linear"
    }
}

export default ToggleButton