import React from 'react'

import Image from 'next/future/image'

import { ApplicationCardTypes } from 'models/User/User.types'

import marker from 'public/marker.svg'
import dollar from 'public/dollar.svg'

import styles from 'styles/MyApplicationCard.module.css'
interface MyApplicationCardProps extends ApplicationCardTypes {

}
const MyApplicationCard:React.FC<MyApplicationCardProps> = ({application_id, application_date, application_seen, job_postal, job_name, job_salary, job_city })=>{
    return (
        <div key={application_id} className={`${styles.application} box_shadow next_row_margin`}>
            <div className={styles.application_info}>
                <h1>{job_name} </h1>
                <p>{application_date}</p>
                <div className={styles.application_info_row}>
                    <Image src={marker} alt="marker" className={styles.application_info_row_icon}/>
                    <p>{job_city}, {job_postal} </p>
                </div>
                <div className={styles.application_info_row}>
                    <Image src={dollar} alt="dollar" className={styles.application_info_row_icon}/>
                    <p>{job_salary} </p>
                </div>
            </div>
            <div data-content={application_seen ? "Votre CV a ete vu" : "Votre CV n'a pas ete vu"} className={styles.application_seen}>{application_seen ? "👁" : "🙈"} </div>

        </div>
    )
}

export default MyApplicationCard