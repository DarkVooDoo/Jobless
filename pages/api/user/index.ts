import {NextApiResponse, NextApiRequest} from 'next'

import { CreateUser, AuthenticateUser, UserAuthorization } from 'models/User/User.model'

const Router = async (req:NextApiRequest, res:NextApiResponse)=>{

    if(req.method === "PUT"){
        try{
            await CreateUser(req.body)
            res.send({status: "Success"})
        }catch(err){
            res.status(403).send({status: "Forbidden"})
        }
    }else if(req.method === "POST"){
        try{
            const {id, name, photo, token, role} = await AuthenticateUser(req.body)
            res.setHeader("Set-Cookie", `Authorization-Token=${token};Path=/;SameSite=Strict;Max-Age=${60*60*24*3}`)
            res.send({id, name, photo, role})
        }catch(err){
            res.status(403).send({status: "Forbidden"})
        }
    }else if(req.method === "GET"){
        try{
            const {id, name, photo, role} = UserAuthorization(req.cookies["Authorization-Token"] ?? req.headers["authorization-token"]?.toString())
            res.send({id, name, photo, role})
        }catch(err){
            res.status(403).send({status: "Forbidden"})
        }
    }
}

export default Router