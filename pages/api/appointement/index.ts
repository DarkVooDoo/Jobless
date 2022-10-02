import { NextApiRequest, NextApiResponse } from "next"

import {CreateAppointement, GetMyAppointements} from 'models/Appointement/Appointement.model'

export default async (req:NextApiRequest, res:NextApiResponse)=>{
    switch(req.method){
        case "POST":
            await CreateAppointement(req.body.user_id)
            res.send("OK")
            break
        default:
            const appointement = await GetMyAppointements(req.query.userId)
            res.send(appointement)
            break
    }
}