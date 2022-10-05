import { verify } from 'jsonwebtoken'
import { CreateJob, GetLatestJobs } from 'models/Job/Job.model'

import { NextApiRequest, NextApiResponse } from 'next'

const Router =async (req: NextApiRequest, res: NextApiResponse)=>{

    if(req.method === "POST"){        
        try{
            const token = req.cookies["Authorization-Token"]
            if(token){
                const {id}:any = verify(token, process.env.JWT_SECRET_KEY ?? "secretkey")
                const job_id = await CreateJob({...req.body, user_id: id})
                res.send(job_id)
                return
            }
            res.status(403).send("Forbidden")
        }catch(err){
            res.status(403).send("Forbidden")
        }
    }else if(req.method === "GET"){
        try{
            const page = req.query.page?.toString()
            const jobs = await GetLatestJobs(parseInt(page ?? "1"))
            res.send(jobs)
        }catch(err){
            res.status(403).send({status: "Failed"})
        }
    }

}

export default Router

