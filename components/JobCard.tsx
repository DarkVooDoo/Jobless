import Image from 'next/future/image'
import {useRouter} from 'next/router'

import { JobCardTypes } from 'models/Job/Job.types'

import styles from "styles/JobCard.module.css"

import PE from 'public/pole_emploi_logo.png'
import logo from 'public/logo.png'
import marker from 'public/marker.svg'
import dollar from 'public/dollar.svg'
import { ROUTES_PATHS } from 'utils/contexts'

interface JobCardProps extends JobCardTypes {
    
}
const JobCard:React.FC<JobCardProps> = ({job_id, job_name, job_salary, job_created, job_from, job_postal, job_city })=>{
    const router = useRouter()
    return (
        <div className={styles.card} >
            <h1 className={`${styles.card_name} next_row_margin`} onClick={()=>router.push(`${ROUTES_PATHS.job}/${job_id}${job_from ? `?type=${job_from}` : ""}`)}>{job_name}</h1>
            <div className={`${styles.card_location} next_row_margin`}>
                <Image src={marker} alt="marker" className={styles.card_location_icon} />
                <p>{job_city} {job_postal} </p>
            </div>
            <div className={`${styles.card_location} next_row_margin`}>
                <Image src={dollar} alt="dollar" className={styles.card_location_icon} />
                <p>{job_salary ? job_salary : "L'employeur n'a pas mis de remuneration"} </p>
            </div>
            <div className={styles.card_date} >
                <p>{job_created} </p>
                {job_from === "Pole Emploi" ? <Image src={PE} alt="pole emploi" className={styles.card_icon} /> :<Image src={logo} className={styles.card_icon} alt="jobless" />}
            </div>
        </div>

    )
}

export default JobCard