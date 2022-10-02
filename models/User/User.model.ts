
import DB from 'models/DBConn'

import {sign, verify} from 'jsonwebtoken'
import {randomBytes, scryptSync} from 'crypto'

import {UserContextTypes, CreateUserTypes, AuthenticateUserTypes} from 'models/User/User.types'
import { UserProfileTypes } from 'models/User/User.types'

const PASSWORD_KEY_LENGHT = 125

export const CreateUser = async ({name, lastname, password, email, role}:CreateUserTypes)=>{
    try{
        const salt = randomBytes(32).toString("hex")
        const cryptedPassword = scryptSync(password, salt, PASSWORD_KEY_LENGHT).toString('hex')
        await DB.query(`INSERT INTO Users (user_name, user_lastname, user_salt, user_password, user_email, user_role) VALUES($1,$2,$3,$4,$5,$6)`, [name, lastname, salt, cryptedPassword, email, role])
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const GetUserProfile = async (id: string):Promise<UserProfileTypes>=>{
    try{
        const {rows} = await DB.query(`SELECT user_name, user_lastname, user_id, user_email, user_joined, user_postal, user_city, user_adresse, user_role FROM Users WHERE user_id=$1`, [id])
        return rows[0]
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const ModifyUserProfile = async ({user_id, user_name, user_lastname, user_city, user_postal, user_adresse, user_coord}:UserProfileTypes)=>{
    try{
        await DB.query(`UPDATE Users SET user_name=$1, user_lastname=$2, user_city=$3, user_postal=$4, user_adresse=$5 WHERE user_id=$6`, [user_name, user_lastname, user_city, user_postal, user_adresse, user_id])
    }catch(err){
        console.log(err)
        throw("Error")
    }
}

export const AuthenticateUser = async ({email, password}:AuthenticateUserTypes)=>{
    try{
        const {rows} = await DB.query(`SELECT user_id, user_name, user_photo, user_salt, user_password, user_role FROM Users WHERE user_email=$1`, [email])
        const {user_password, user_salt, user_id, user_name, user_photo, user_role} = rows[0]
        const cryptedPassword = scryptSync(password, user_salt, PASSWORD_KEY_LENGHT).toString('hex')
        if(cryptedPassword === user_password) {
            const {token} = CreateToken(user_id, user_name, user_photo, user_role)
            return {id: user_id, name: user_name, photo: user_photo, token, role: user_role}
        }
        throw("Error")
    }catch(err){
        console.log(err)
        throw(err)
    }
}

export const UserAuthorization = (token: string | undefined)=>{
    try{
        if(!token) throw("Error")
        const user = verify(token, process.env.JWT_SECRET_KEY ?? "secretkey")
        return user as UserContextTypes
    }catch(err){
        throw("Error")
    }
}

export const CreateToken = (id: string, name: string, photo: string | null, role: string)=>{
    return {
        token: sign({id, name, photo, role}, process.env.JWT_SECRET_KEY ?? "secretkey", {expiresIn: "3 days"})
    }
}