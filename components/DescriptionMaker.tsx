import React, {useRef} from 'react'

import styles from "styles/CreateJob.module.css"

interface DescriptionMakerProps {
    onDescriptionChange: (description: string | undefined)=>void
}
const DescriptionMaker:React.FC<DescriptionMakerProps> = ({onDescriptionChange })=>{
    const displayRef = useRef<HTMLDivElement>(null)
 
    const onCreateSimpleElement = (type: string)=>{
        const element = document.createElement(type)
        element.textContent = "Text"
        displayRef.current?.append(element)
    }

    const onCreateListElement = ()=>{
        const element = document.createElement("ul")
        element.classList.add(styles.form_description_list)
        const li = document.createElement("li")
        element.append(li)
        li.textContent = "Title"
        displayRef.current?.append(element)
    }

    return (
        <>
            <div className={styles.form_description_top}>
                <h5>Description</h5>
                <div className={styles.form_description_buttons}>
                    <button className={styles.form_description_buttons_btn} type="button" onClick={()=>onCreateSimpleElement("h1")}>Header</button>
                    <button className={styles.form_description_buttons_btn} type="button" onClick={()=>onCreateSimpleElement("b")}>Bold</button>
                    <button className={styles.form_description_buttons_btn} type="button" onClick={onCreateListElement}>List</button>
                </div>
            </div>
            <div ref={displayRef} className={styles.form_description} contentEditable onBlur={()=>{onDescriptionChange(displayRef.current?.innerHTML)}}>

            </div>
        </>

    )
}

export default DescriptionMaker