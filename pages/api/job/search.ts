import { GetSearchJobs } from 'models/Job/Job.model'
import { JobCardTypes } from 'models/Job/Job.types'
import {NextApiRequest, NextApiResponse} from 'next'

const cacheMap = new Map<string, {payload: JobCardTypes[], expIn: number}>()

const Router = async (req: NextApiRequest, res: NextApiResponse)=>{
    if(req.method === "GET"){
        try{
            const query:any = req.query
            const jobs = await GetSearchJobs(query)
            // res.setHeader("Cache-Control", `max-age=${60*3}`)
            res.send(jobs)
        }catch(err){
            res.status(403).send({status: "Failed"})
        }
    }
}

export default Router