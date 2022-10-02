import { cp } from 'fs/promises'
import React, { ChangeEventHandler, CSSProperties, useContext, useState } from 'react'

import { UserContext } from 'utils/contexts'
import { OnInputChangeTypes } from 'utils/types'
import SimpleInput from './SimpleInput'

type ApplicationType = {
    name: string,
    email: string,
    lastname: string,
    file: File | undefined
}
interface ChoseCVProps {
    job_id: string,
    onSuccess?: ()=> void,
    onFail?: ()=> void
}
const ChoseCV:React.FC<ChoseCVProps> = ({onSuccess, job_id, onFail })=>{
    const [user] = useContext(UserContext)

    const [application, setApplication] = useState<ApplicationType>({name: "", email: "", lastname: "", file: undefined})
    const [fileUrl, setFileUrl] = useState<{name: string, url: string}>({name: "", url: ""})

    const onSendJobApplication:React.FormEventHandler = async (e)=>{
        e.preventDefault()        
        if(application.file){
            const forms = new FormData()
            forms.set("job_id", job_id)
            for(let [key, value] of Object.entries(application)){
                value && forms.set(key, value)
            }
            const uploadFile = await fetch(`/api/job/application`, {
                method: "POST",
                body: forms
            })
            if(uploadFile.status === 200 && onSuccess) {
                onSuccess()
                return
            }
            onFail && onFail()
        }
    }

    const onChoseCV:ChangeEventHandler<HTMLInputElement> = ({currentTarget:{files}})=>{
        const file = files?.item(0)
        if(file){
            const reader = new FileReader()
            reader.onloadend = (e)=>{
                const fileString = e.target?.result
                fileString && setFileUrl({name: file.name, url: fileString.toString()})
                setApplication(prev=>({...prev, file: file}))
            }
            reader.readAsDataURL(file)
        }
    }

    const onInputChange = ([name, value]:OnInputChangeTypes)=>setApplication(prev=>({...prev, [name]: value}))

    return (
        <form onSubmit={onSendJobApplication} style={{backgroundColor: "white", padding: ".5rem", borderRadius: "5px"}}>
            <h1 className={`next_row_margin`} style={styles.header}>Envoyer votre candidature</h1>
            <div className={`next_row_margin`} style={styles.file}>
                <div style={styles.cv}>
                    <input type="file" name="file" id="file" accept='image/*, application/pdf' required style={styles.cv_input} onChange={onChoseCV} />
                    <label htmlFor="file" style={styles.cv_label}>CV</label>
                </div>
                <a target="_blank" href={fileUrl.url} rel="noreferrer" style={styles.cv_viewfile}>{fileUrl.name} </a>
            </div>
            {!user && <div style={styles.textfield}>
                <SimpleInput {...{label: "Prenom", name:"name", value: application.name, onInputChange, className: 'input next_row_margin'}} />
                <SimpleInput {...{label: "Nom", name:"lastname", value: application.lastname, onInputChange, className: 'input next_row_margin'}} />
                <SimpleInput {...{label: "Email", name:"email", value: application.email, onInputChange, className: 'input next_row_margin'}} />
            </div>}
            <div style={styles.submit}>
                <button type="submit" className={`button`}>Envoyer</button>
            </div>
        </form>

    )
}

const styles: {[key:string]: CSSProperties} = {
    header:{
        textAlign: "center",
        fontSize: "1.1rem"
    },
    submit:{
        display: "flex",
        justifyContent: "flex-end"
    },
    file:{
        display: "flex",
        alignItems: "center",
        gap: ".5rem"
    },
    cv:{
        position: "relative",
        height: "2rem",
        width: "4rem",
        backgroundColor: "var(--Silver-Color)",
        borderRadius: "5px"
    },
    cv_input:{
        display: "none"
    },
    cv_label:{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    cv_image:{
        position: "absolute",
        display: "block",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: "none",
    },
    cv_image_tag:{
        height: "100%",
        width: "100%",
        borderRadius: "5px"
    },
    cv_viewfile:{
        color: "blue",
        textDecorationLine: "underline"
    },
    textfield:{
        width: "70vw"
    }
}

export default ChoseCV