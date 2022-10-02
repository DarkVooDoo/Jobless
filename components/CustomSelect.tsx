import React, {useEffect, useRef, useState } from 'react'

import styles from "styles/CustomSelect.module.css"


interface CustomSelectProps {
    values: string[]
    itemSelected?: string,
    className?: string,
    onSelectedChange?: (selectedItem: string)=>void 
}
const CustomSelect:React.FC<CustomSelectProps> = ({onSelectedChange, values, itemSelected})=>{
    const optionsRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(itemSelected === "" ? values[0] : itemSelected)

    useEffect(()=>{
        setSelected(itemSelected ?? values[0])
    },[itemSelected])

    const options = values.map(item=>(
        <div key={Math.random()} className={styles.options_value} onClick={({currentTarget:{innerText}})=>{
            setSelected(innerText)
            onSelectedChange && onSelectedChange(innerText)
            setIsOpen(false)    
        }} >
            <p>{item}</p>
        </div>
    ))
    return (
        <div className={styles.container}>
            <div className={`${styles.select} ${isOpen && styles.open_options}`} 
                style={{width: optionsRef.current?.clientWidth}} onClick={()=>setIsOpen(prev=>!prev)}>
                    {selected}
            </div>
            <div ref={optionsRef} className={`${styles.options}`} style={isOpen ? {opacity:"1", pointerEvents: "all"} : {opacity: "0", pointerEvents: "none"}} >
                {options}
            </div>
        </div>

    )
}



export default CustomSelect