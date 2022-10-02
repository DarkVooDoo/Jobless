import {NextPage} from 'next'
import Head from 'next/head'

import {useState } from 'react'

import DescriptionMaker from 'components/DescriptionMaker'
import SimpleInput from 'components/SimpleInput'
import ToggleButton from 'components/ToggleButton'

import styles from "styles/CreateJob.module.css"
import { OnInputChangeTypes } from 'utils/types'

import JobController from 'controllers/Job.controller'
import { CreateJobTypes } from 'models/Job/Job.types'
import CustomSelect from 'components/CustomSelect'
import {DropdownList, DropdownRow } from 'components/Dropdown'

const CONTRAT_TYPE = ["CDD", "CDI", "Interim"]
const SALARY_FORMAT = ["Heure", "Mois", "An"]

const CreateJob:NextPage = ({ })=>{
    const jobController = new JobController()

    const [job, setJob] = useState<CreateJobTypes>({user_id: "", title: "", salary: "1250", contrat: "CDD", description: "", time: "", city: "", postal: "", places: "1", 
    categorie: "", tags: [], fullTime: false, postulationUrl: "https://"})
    const [salaryFormat, setSalaryFormat] = useState("Par Mois")
    const [tag, setTag] = useState("")

    const onCreateJob:React.FormEventHandler = (ev)=>{
        ev.preventDefault()
        jobController.CreateJob(job, salaryFormat)
    }

    const onInputChange = ([name, value]:OnInputChangeTypes)=>{setJob(prev=>({...prev, [name]: value}))}

    return (
        <>
            <Head>
               <title>Create Job</title> 
            </Head>
            <form onSubmit={onCreateJob}>
                <h1 className={styles.form_header}>Creation une offre</h1>
                <SimpleInput {...{label: "Nom", name: "title", onInputChange, value: job.title, className: `${styles.form_name} input`}} />
                <div className={styles.form_flex}>
                    <SimpleInput {...{label: "City", name: "city", onInputChange, value: job.city, className: "input half"}} />
                    <SimpleInput {...{label: "Postal", name: "postal", type: "number", onInputChange, value: job.postal, className: "input half"}} />
                </div>
                <div className={styles.form_flex}>
                    <SimpleInput {...{
                        label: "Salary", 
                        name: "salary", 
                        onInputChange, 
                        value: job.salary, 
                        className: "input half"}} />
                    <SimpleInput {...{label: "Temps de traivail", name: "time", type: "number", onInputChange, value: job.time, className: "input half"}} />
                </div>
                <div className={styles.form_flex}>
                    <CustomSelect {...{values: CONTRAT_TYPE, onSelectedChange: (contrat)=>setJob(prev=>({...prev, contrat}))}} />
                    <CustomSelect {...{values: SALARY_FORMAT, onSelectedChange: (salaryFormat)=>setSalaryFormat(salaryFormat)}} />
                    <div>
                        <p>Temps Plein</p>
                        <ToggleButton {...{state: job.fullTime, onStateChange: (state)=>setJob(prev=>({...prev, fullTime: state}))}} />
                    </div>
                </div>
                <div className={styles.form_flex}>
                    <div style={{position: 'relative'}}>
                        <SimpleInput {...{label: "Categorie", name: "categorie", type: "text", value: job.categorie, onInputChange, className: "input"}} />
                        <DropdownList {...{values: ["Agriculture", "Public", "Restauration"]}} />
                    </div>
                    <SimpleInput {...{label: "Nbr de poste", name: "places", type: "number", value: job.places, onInputChange, className: "input half"}} />
                </div>
                <DescriptionMaker {...{onDescriptionChange: (description = "")=>setJob(prev=>({...prev, description}))}} />
                
                {/* <SimpleInput {...{label: "Tags", name: "tag", onInputChange,value: tag, className: "input"}} /> */}

                <SimpleInput {...{label: "Lien pour postuler", name: "postulationUrl", onInputChange, value: job.postulationUrl, className: `${styles.form_link} input`}} />
                <div className={styles.form_lien}>
                    <button type='submit' className={`button`}>Creer Job</button>
                </div>
            </form>

        </>
    )
}

export default CreateJob