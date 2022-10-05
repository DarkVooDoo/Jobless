import DB from 'models/DBConn'
import { GetTimeDifferential, postgresAgeToString, sortedJobs, stringToHtml } from 'utils/Helpers'

import { PoleEmploiPayloadTypes } from 'models/Job/Job.types'
import {JobCardTypes} from 'models/Job/Job.types'

import { CreateJobTypes, JobPayloadTypes } from './Job.types'
import { SearchTypes } from 'utils/types'

const POLE_EMPLOI_BASE_API = "https://api.emploi-store.fr/partenaire/offresdemploi/v2/offres"


const GetPoleEmploiTokens = async ()=>{
    const requetePayload = "grant_type=client_credentials&client_id=PAR_ndepart_39b9519b2f103a4d00d809e6ae5d5607ea073add8a9946af3be179fa9382db2e&client_secret=6f833954cb4be784d61b2ad0b394f2a1f805f06055738488479672a7796cfe85&scope=api_offresdemploiv2 o2dsoffre"
    const poleEmploiCredentials = await fetch(`https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire`, {
        method: "POST",
        headers: [["Content-Type", "application/x-www-form-urlencoded"]],
        body: requetePayload
    })
    const {access_token, token_type} = await poleEmploiCredentials.json()
    return {access_token, token_type}
}

const GetPoleEmploiJobs = async <T>(path: string):Promise<T | undefined>=>{ 
    const {access_token, token_type} = await GetPoleEmploiTokens()
    const fetchPoleEmploi = await fetch(path, {
        headers: [["Authorization", `${token_type} ${access_token}`]]
    })
    if(fetchPoleEmploi.status > 206 || fetchPoleEmploi.status === 204) return undefined
    const payload = await fetchPoleEmploi.json() as T
    return payload
}

export const GetSearchJobs = async ({contrat, search, postal, fullTime = true, page = "1"}:SearchTypes):Promise<JobCardTypes[]>=>{
    try{
        const _page = parseInt(page)
        const postgresJobContrat = contrat === "Tout" ? undefined : contrat
        const poleEmploiContrat = contrat === 'Tout' ? 'CDI,CDD' : contrat
        const slicedPostal = postal.slice(0,2)

        const query = `${POLE_EMPLOI_BASE_API}/search?typeContrat=${poleEmploiContrat}&origineOffre=1&motsCles=${search}&tempsPlein=${fullTime}&range=0-5&departement=${slicedPostal}&distance=0&range=0-${_page*4}`
        const payload = await GetPoleEmploiJobs<{resultats: PoleEmploiPayloadTypes[]}>(query)
        const adaptedPayload:JobCardTypes[] = payload ? payload.resultats.map(item=>{
            const [_, job_city] = item.lieuTravail.libelle.split("-")
            return {job_id: item.id, job_name: item.intitule, job_salary: item.salaire.libelle, job_created: item.dateCreation, job_from: "Pole Emploi", job_city, job_postal: item.lieuTravail.codePostal}
        }) : []
       
        const posgresqlStatement = [search, `${slicedPostal}%`, postgresJobContrat].filter(item=>item && item.length > 1)
        const {rows} = await DB.query<JobCardTypes>(`SELECT job_id, job_name, job_created, job_postal FROM Job 
        WHERE job_name_vector @@ to_tsquery('French',$2) AND job_isfulltime=$1 ${postal && 'AND job_postal LIKE $3'} ${postgresJobContrat ? 'AND job_contrat=$4' : ""} ORDER BY job_created ASC LIMIT ${_page*5}`, 
        [fullTime, ...posgresqlStatement])
       
        const sortJobs = sortedJobs(...rows, ...adaptedPayload)
        return sortJobs
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const GetSiglePoleEmploiJob = async (id: string):Promise<JobPayloadTypes | any[]>=>{
    try{
        const payload = await GetPoleEmploiJobs<PoleEmploiPayloadTypes>(`${POLE_EMPLOI_BASE_API}/${id}`)    
        if(!payload) return []
        const [_, job_city] = payload.lieuTravail.libelle.split("-")
        const job_created = GetTimeDifferential(new Date(payload.dateCreation).getTime())
        const job_description = stringToHtml(payload.description)
        return {
            job_id: payload.id, 
            job_name: payload.intitule, 
            job_entreprise: payload.entreprise.nom,
            job_created, 
            job_city,
            job_hours: payload.dureeTravailLibelle,
            job_contrat: payload.typeContrat,
            job_postal: payload.lieuTravail.codePostal,
            job_salary: payload.salaire.libelle,
            job_description, 
            job_from: "Pole Emploi", 
            job_user_id: null,
            job_postulation: payload.contact.urlPostulation ?? payload.origineOffre.urlOrigine}
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const GetLatestJobs = async (page: number = 1):Promise<JobCardTypes[]>=>{
    try{
        const slicedPostal = "93"
        let peRows: JobCardTypes[] = []
        const payload = await GetPoleEmploiJobs<{resultats: PoleEmploiPayloadTypes[]}>(`${POLE_EMPLOI_BASE_API}/search?range=0-${page*4}`)
        if(payload){
            peRows = payload.resultats.map<JobCardTypes>((item)=>{
                const [_, job_city] = item.lieuTravail.libelle.split("-")
                return {job_id: item.id, job_name: item.intitule, job_created: item.dateCreation, job_from: "Pole Emploi", job_salary: item.salaire.libelle, job_city, job_postal: item.lieuTravail.codePostal}
            })
        }
        const {rows} = await DB.query(`SELECT job_name, job_id, job_salary, job_created, job_postal, job_city FROM Job ORDER BY job_created ASC LIMIT ${page*5}`)
        const jobs = sortedJobs(...peRows, ...rows)
        return jobs
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const CreateJob = async ({title, description, contrat, salary, time, user_id, city, fullTime, postal, postulationUrl, tags}:CreateJobTypes)=>{
    try{
        const {rows} = 
        await DB.query(`INSERT INTO Job 
        (job_name, job_salary, job_hours, job_description, job_contrat, job_name_vector, job_city, job_postal, job_postulation, job_isfulltime, job_user_id) 
        VALUES ($1,$2,$3,$4,$5,to_tsvector('French',$6),$7,$8,$9,$10,$11) RETURNING job_id`, [title, salary, time, description, contrat, title, city, postal, postulationUrl, fullTime, user_id])
        return rows[0]
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const GetSingleJob = async (id: string):Promise<JobPayloadTypes>=>{
    try{
        const query = `SELECT job_id, job_name, job_description, job_contrat, job_user_id, job_city, job_postal, job_salary, job_hours, job_created, user_lastname AS job_entreprise 
        FROM Job LEFT JOIN Users ON job_user_id=user_id WHERE job_id=$1`
        const {rows} = await DB.query(query, [id])
        const job_created = GetTimeDifferential(new Date(rows[0].job_created).getTime())
        return {...rows[0], job_created}
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const DeleteJob = async (id: string)=>{
    try{
        await DB.query(`DELETE FROM Job WHERE job_id=$1`, [id])
    }catch(err){
        console.log(err)
        throw("Error")
    }
}