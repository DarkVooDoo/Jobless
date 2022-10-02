import { NextApiRequest, NextApiResponse } from "next"

import internal from "stream"
import { Socket } from "net"

import Websocket, {WebSocketServer, Server} from 'ws'

import crypto from 'crypto'
import { IncomingMessage } from "http"
import { GetUserInCall, InsertCandidate } from "models/Appointement/Appointement.model"

const allAppointements = {
    test: {
        isFresh: false,
        users: [{id: "2", name: "LT", session: "session", candidate: "ice candidate"}, "2", "4"]
    }
}

export type CallUserValuesTypes = {
    candidate_id: string, 
    candidate_session: string, 
    candidate_candidate: string, 
    user_name: string, 
    user_id: string
}

export type UserTypes = {
    [key: string]: CallUserValuesTypes
}

let websocket:Server 
export const userSockets:{roomId: string, socket: Websocket, userId: string}[] = []

export default async (req: NextApiRequest, res: NextApiResponse)=>{
    switch(req.method){
        case "GET":
            if(websocket){
                res.status(403).send("Server Already Exist")
                return
            }
            websocket = new WebSocketServer({
                port: 1234
            })
            websocket.on("connection", async (socket, request: IncomingMessage)=>{
                const roomId = req.query.id
                const userAdresse = request.socket.remoteAddress
                if(!userAdresse || !roomId) return
                userSockets.push({roomId: roomId.toString(), socket, userId: userAdresse})
                const usersInCall = await GetUserInCall<CallUserValuesTypes>(roomId)
                userSockets.filter(item=>item.roomId === roomId).forEach(item=>{
                    item.socket.send(JSON.stringify(usersInCall))
                })

                socket.on("message", async (data)=>{
                    console.log(data.toString("utf8"))
                })
                socket.on("close", ()=>{
                    const userIndex = userSockets.findIndex(item=>item.userId === userAdresse)
                    userSockets.splice(userIndex, 1)
                })
            })

            res.send("Server Created")
            break
        case "POST":
            const roomId = req.query.id
            const allUsers = await InsertCandidate(req.body)
            userSockets.filter(item=>item.roomId === roomId).forEach(item=>{
                item.socket.send(JSON.stringify(allUsers))
            })
            res.send("Created")
            break
        default:
            throw("Not Found")
    }
}