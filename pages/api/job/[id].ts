import {NextApiRequest, NextApiResponse} from 'next'

import {DeleteJob, GetSiglePoleEmploiJob, GetSingleJob} from 'models/Job/Job.model'

const Router = async (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method === "GET"){
        try{
            const id = req.query.id?.toString()
            const type = req.query.type?.toString()
            if(!type && id){
                const job = await GetSingleJob(id)
                res.send(job)
            }else if(type === "Pole Emploi" && id){
                const poleEmploiJob = await GetSiglePoleEmploiJob(id)
                res.send(poleEmploiJob)
            }
        }catch(err){
            res.status(403).send({status: "Forbidden"})
        }
    }else if(req.method === "DELETE"){
        try{
            const id = req.query.id?.toString()
            if(id){
                await DeleteJob(id)
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