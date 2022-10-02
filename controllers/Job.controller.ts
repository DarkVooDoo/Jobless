import { CreateJobTypes } from 'models/Job/Job.types';
import {NextRouter, useRouter} from 'next/router'
import { ROUTES_PATHS } from 'utils/contexts';
import User from './User.controller';

export default class Job extends User{
    private id: string | undefined;
    router: NextRouter = useRouter()
    
    constructor(id?:string){
        super()
        this.id = id
    }

    async CreateJob(job:CreateJobTypes, salaryForm: string){
        const salary = `${job.salary}£ ${salaryForm}`
        const time = `${job.time}H ${salaryForm}`
        const postJob = await fetch(`/api/job`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({...job, salary, time})
        })
        if(postJob.status === 200) {
            const {job_id} = await postJob.json()
            this.router.push(`${ROUTES_PATHS.job}/${job_id}`)
        }
    }

    async DeleteJob(){
        const deleteJob = await fetch(`/api${ROUTES_PATHS.job}/${this.id}`, {
            method: "DELETE"
        })
        if(deleteJob.status === 200) this.router.push(ROUTES_PATHS.home)
    }
}