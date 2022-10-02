import formidable from 'formidable'
import DB from 'models/DBConn'
import { GetTimeDifferential } from 'utils/Helpers'

export type InsertUserApplicationTypes = {
    job_id: string,
    name: string,
    lastname: string,
    email: string,
    file: formidable.File | formidable.File[],
    userId: string | undefined
}

export const InsertUserApplication = async ({job_id, name, lastname, email, file, userId}:InsertUserApplicationTypes)=>{
    const connection = await DB.connect()
    try{
        if(userId){
            console.log("User Connected")
            await connection.query("BEGIN")
            const {rows} = await connection.query(`SELECT application_email FROM Applications WHERE application_user_id=$1`, [userId])
            if(rows.length > 0) throw ("Already has a application")
            await connection.query(`INSERT INTO Applications (application_cv, application_user_id, application_job_id) VALUES($1,$2,$3)`, ["The CV Url after uploading to S3", userId, job_id])
            await connection.query("COMMIT")
        }else{
            console.log("Not Connected")
            await connection.query("BEGIN")
            const {rows} = await connection.query(`SELECT application_email FROM Applications WHERE application_email=$1`, [email])
            if(rows.length > 0) throw ("Already has a application")
            await connection.query(`INSERT INTO Applications (application_cv, application_job_id, application_name, application_lastname, application_email) VALUES($1,$2,$3,$4,$5)`, 
            ["The CV Url after uploading to S3", job_id, name, lastname, email])
            await connection.query("COMMIT")
        }

    }catch(err){
        console.log(err)
        await connection.query("ROLLBACK")
        throw("Error")
    }finally{
        connection.release()
    }
}

export const GetUserApplications = async (userId: string)=>{
    try{
        const {rows} = await DB.query(`SELECT application_id, application_seen, job_name, application_date, job_city, job_postal, job_salary FROM Applications RIGHT JOIN Job ON job_id=application_job_id WHERE application_user_id=$1`, [userId])   
        const payloadWithFormatedDate = rows.map(item=>{
            const application_date = GetTimeDifferential(item.application_date)
            return {...item, application_date}
        })
        return payloadWithFormatedDate
    }catch(err){
        console.log(err)
        throw("Error")
    }
}