import React from 'react'

import { OnInputChangeTypes } from 'utils/types'

interface SimpleInputProps {
    value: string,
    name: string,
    label: string,
    className?: string | undefined,
    type?: "text" | "number" | "password"
    onInputChange: (values: OnInputChangeTypes)=> void
}
const SimpleInput:React.FC<SimpleInputProps> = ({onInputChange, value, name, label, className, type = "text" })=>{
    const regex = new RegExp(/[\d]$/, "g")
    return (
        <div className={className}>
            <input type={type} className="form_input" name={name} id={name} required value={value} onChange={({currentTarget})=>{
                const name = currentTarget.name
                const value = currentTarget.value
                onInputChange([name, value])
            }} />
            <label htmlFor={name} className="form_label">{label} </label>
        </div>

    )
}

export default SimpleInput