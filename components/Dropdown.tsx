import React, { CSSProperties } from 'react'

//TODO: pouvoir marcher avec n'importe quell parent container

interface DropdownListProps{
    values: string[],
    onSelect?: (value: string)=>void
}

interface DropdownRowProps{
    value: string,
    onSelect?: (value: string)=>void
}

//${item.properties.name}, ${item.properties.postcode}, ${item.properties.city}
export const DropdownList:React.FC<DropdownListProps> = ({values, onSelect})=>{
    const list = values.map(item=><DropdownRow key={Math.random()} {...{value: `${item}`, onSelect}} />)
    return (
        <div style={styles.list}>
            {list}
        </div>
    )
}

export const DropdownRow:React.FC<DropdownRowProps> = ({value, onSelect })=>{
    return (
        <div style={styles.row} 
            onMouseEnter={({currentTarget})=>currentTarget.classList.add("highlight")} 
            onMouseLeave={({currentTarget})=>currentTarget.classList.toggle("highlight")} 
            onClick={()=>onSelect && onSelect(value)}>
            <p>{value} </p>
        </div>

    )
}

const styles:{[key: string]: CSSProperties} = {
    list:{
        position: "absolute", 
        top: "calc(var(--Mobile-Input-Height) + .3rem)", 
        left: 0, width: "100%", 
        height: "max-content", 
        zIndex: 100, 
        backgroundColor: "white",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)"
    },
    row: {
        height: "var(--Mobile-Input-Height)",
        display: "flex",
        padding: "0 .5rem",
        alignItems: "center",
        backgroundColor: "white",
        transition: "background-color .3s linear"
    }
}

