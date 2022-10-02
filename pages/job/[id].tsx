
import {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/future/image'

import { useContext, useEffect, useRef, useState } from 'react'

import ChoseCV from 'components/ChoseCV'
import Modal from 'components/Modal'

import { UserContext } from 'utils/contexts'
import { JobPayloadTypes } from 'models/Job/Job.types'

import clock from 'public/clock.svg'
import marker from 'public/marker.svg'
import contrat from 'public/contrat.svg'
import dollar from 'public/dollar.svg'

import styles from 'styles/Job.module.css'
import JobController from '../../controllers/Job.controller'
import Notification from 'components/Notification'

interface JobProps extends JobPayloadTypes {}

const Job:NextPage<JobProps> = ({job_id, job_name, job_contrat, job_from, job_entreprise, job_created, job_description, job_salary, job_hours, job_user_id, job_postulation, job_city, job_postal })=>{
    const jobController = new JobController(job_id)
    const [user] = useContext(UserContext)
    const descriptionRef = useRef<HTMLDivElement>(null)

    const [isChoseCV, setIsChoseCV] = useState(false)  
    
    useEffect(()=>{  
        const ref = descriptionRef.current
        if(ref){
            ref.innerHTML = job_description
        }
    }, [])
    const isOffertThirdParty = job_postulation 
    const postulerButton = isOffertThirdParty ? 
        <button className={styles.form_submitBtn}><a target="_blank" rel="noreferrer" className={styles.form_submitBtn_link} href={job_postulation}>Postuler</a></button> 
        : user?.id !== job_user_id && user?.role === "User" && <button className={styles.form_submitBtn} onClick={()=>setIsChoseCV(prev=>(!prev))}>Postuler</button>
    return (
        <>
            <Head>
                <title>{job_name}</title>
            </Head>
            <div>
                <h1 className={styles.job_title} onClick={()=>setIsChoseCV(prev=>(!prev))}>{job_name} </h1>
                <p className={`next_row_margin`}>Entreprise: {job_entreprise} </p>
                <div className={styles.job_infos}>
                    <div  className={styles.job_infos_salary}>
                        <Image src={dollar} alt="dollar" className={styles.job_infos_salary_icon}/>
                        <p>{job_salary ? job_salary : "L'employeur n'a pas mis de remuneration"} </p>
                    </div>
                    <p className={styles.job_infos_date}>{job_created} </p>
                </div>
                <div className={styles.job_about}>
                    <div className={styles.job_about_box}>
                        <Image src={marker} alt="marker" className={styles.job_about_box_icon}/>
                        <p className={styles.job_about_box_text}>{job_city}</p>
                        <p className={styles.job_about_box_text}> {job_postal}</p>
                    </div>
                    <div className={styles.job_about_box}>
                        <Image src={clock} alt="clock" className={styles.job_about_box_icon}/>
                        <p className={styles.job_about_box_text}>{job_hours} </p>
                    </div>
                    <div className={styles.job_about_box}>
                        <Image src={contrat} alt="contrat" className={styles.job_about_box_icon}/>
                        <p className={styles.job_about_box_text}>{job_contrat} </p>
                    </div>
                </div>
                <div ref={descriptionRef} className={styles.job_description}></div>
                {postulerButton}
                {user?.id === job_user_id && <div>
                    <button className={`${styles.form_submitBtn} ${styles.form_deleteBtn}`} onClick={()=>jobController.DeleteJob()}>Supprimer</button>
                </div>}
                <Modal {...{state: isChoseCV, onStateChange: (state)=>setIsChoseCV(state)}}>
                    <ChoseCV {...{job_id, onSuccess: ()=>{
                        setIsChoseCV(false)
                        jobController.setNotification({isOpen: true, isSuccess: true, message: "Votre Candidature a été envoyer"})
                    }, onFail: ()=>{
                        setIsChoseCV(false)
                        jobController.setNotification({isOpen: true, isSuccess: false, message: "Votre Candidature n'a pas été envoyer"})
                    }}} />
                </Modal>
            </div>
            {jobController.notification.isOpen && 
                <Notification {...{...jobController.notification, onNotificationEnded: ()=>jobController.setNotification({isOpen: false, isSuccess: false, message: "Ended"})}} />
            }
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async ({params, query})=>{
    const id = params?.id
    const isDevelepment = process.env.NODE_ENV === "development"
    return {props:{}}
    // if(!query.type){
    //     const fetchJob = await fetch(`${isDevelepment} ? ${process.env.BASE_URL}/api/job/${id} : ${process.env.PROD_BASE_URL}/api/job/${id}`)
    //     if(fetchJob.status === 403) return {props: {}, redirect: {destination: "/"}}
    //     const payload = await fetchJob.json()
    //     return {props: {...payload}}
    // }else{
    //     const fetchPoleEmploi = await fetch(`${isDevelepment} ? ${process.env.BASE_URL}/api/job/${id}?type=${query.type} : ${process.env.PROD_BASE_URL}/api/job/${id}?type=${query.type}`)
    //     if(fetchPoleEmploi.status !== 200) return {props: {}, redirect: {destination: "/"}}
    //     const payload = await fetchPoleEmploi.json()
    //     return {props: {...payload}}
    // }
}

export default Job