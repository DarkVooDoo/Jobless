
import DB from 'models/DBConn'

type CreateAppointementTypes = {
    session: string,
    candidate: string,
    user_id: string,
    appointement_id: string
}

export const CreateAppointement = async (user_id: string)=>{
    const conn = await DB.connect()
    try{
        await conn.query(`BEGIN`)
        const {rows} = await conn.query(`INSERT INTO Appointement (appointement_date) VALUES(NOW()) RETURNING appointement_id`)
        await conn.query(`INSERT INTO Candidate (candidate_user_id, candidate_appointement_id, candidate_iscreator) VALUES ($1,$2,$3)`, 
        [user_id, rows[0].appointement_id, true])
        await conn.query('COMMIT')
    }catch(err){
        await conn.query('ROLLBACK')
        console.log(err)
        throw("Error")
    }finally{
        conn.release()
    }
}

export const GetMyAppointements = async (user_id:any)=>{
    try{
        const {rows} = await DB.query(`SELECT candidate_iscreator, appointement_id, appointement_date FROM Appointement LEFT JOIN Candidate ON candidate_appointement_id=appointement_id WHERE candidate_user_id=$1`,[user_id])
        return rows
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const GetUserInCall = async <T>(appointementId: any):Promise<T[]>=>{
    try{
        const query = "SELECT candidate_id, candidate_session, candidate_candidate, user_name, user_id FROM Candidate LEFT JOIN Users ON user_id=candidate_user_id WHERE candidate_appointement_id=$1"
        const {rows} = await DB.query(query, [appointementId])
        return rows
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const InsertCandidate = async ({session, candidate, user_id, appointement_id}:CreateAppointementTypes)=>{
    try{
        const query = 
        `INSERT INTO Candidate (candidate_session, candidate_candidate, candidate_user_id, candidate_appointement_id) VALUES ($1,$2,$3,$4)
        ON CONFLICT (candidate_user_id) DO UPDATE SET candidate_session=EXCLUDED.candidate_session, candidate_candidate=EXCLUDED.candidate_candidate`
        await DB.query(query, 
        [session, candidate, user_id, appointement_id])
        const users = await GetUserInCall(appointement_id)
        console.log(users)
        return users
    }catch(err){
        console.log(err)
    }
}