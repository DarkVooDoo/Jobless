import {NextApiRequest, NextApiResponse} from "next"

import formidable from "formidable"
import { InsertUserApplication } from "models/Application/Application.model"
import { verify } from "jsonwebtoken"
import { UserContextTypes } from "models/User/User.types"

const Router = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method === "POST"){
        const form = new formidable.IncomingForm({})
        form.parse(req, async (err, fields, files)=>{
            let userId: string | undefined 
            try{
                const {id} = verify(req.cookies["Authorization-Token"] ?? "", process.env.JWT_SECRET_KEY ?? "secretkey") as UserContextTypes
                userId = id
            }catch(err){}

            try{
                const {mimetype, size, newFilename}:any = files.file
                const t = fields as any
                await InsertUserApplication({...t, file: files.file, userId})
                res.send("Created")
            }catch(err){
                res.status(403).send({status: "Forbidden"})
            }
            
        })
    }
}

export default Router

export const config = {
    api:{
        bodyParser: false,
    }
}