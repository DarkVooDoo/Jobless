import { verify } from 'jsonwebtoken'
import { GetUserApplications } from 'models/Application/Application.model'
import { GetUserProfile, ModifyUserProfile } from 'models/User/User.model'
import {NextApiRequest, NextApiResponse} from 'next'

const Router = async (req: NextApiRequest, res: NextApiResponse)=>{
    if(req.method === "GET"){
        try{
            const cookieToken = req.headers["authorization-token"]?.toString()
            if(cookieToken){
                const {id}:any = verify(cookieToken, process.env.JWT_SECRET_KEY ?? "secretkey")
                const profile = await GetUserProfile(id)
                const applications = await GetUserApplications(id)
                res.send({...profile, applications})
                return
            }
            res.status(403).send({status: "No Authorization Token Send"})
        }catch(err){
            res.status(403).send({status: "User Not Found"})
        }
    }else if(req.method === "PUT"){
        try{
            const cookieToken = req.cookies["Authorization-Token"]?.toString()
            if(cookieToken){
                verify(cookieToken, process.env.JWT_SECRET_KEY ?? "secretkey")
                await ModifyUserProfile(req.body)
                res.send({status: "Success"})
                return
            }
            res.status(403).send({status: "Failed"})
        }catch(err){
            res.status(403).send({status: "Failed"})
        }
    }
}

export default Router