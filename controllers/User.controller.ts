import { NextRouter, useRouter } from "next/router";

import { Dispatch, SetStateAction, useContext, useState } from "react";

import { CreateUserTypes, UserContextTypes, UserProfileTypes } from "models/User/User.types";
import { NotificationTypes, SearchAdresseType } from "utils/types";

import { ROUTES_PATHS, UserContext } from "utils/contexts"
import { deleteCookie } from "utils/Helpers"

export default class User {
    router:NextRouter = useRouter()
    private _notification:[NotificationTypes, Dispatch<SetStateAction<NotificationTypes>>] = useState<NotificationTypes>({message: "", isSuccess: false, isOpen: false})
    notification: NotificationTypes
    setNotification: Dispatch<SetStateAction<NotificationTypes>>

    private _user:[UserContextTypes | undefined, (user: UserContextTypes | undefined)=>void] = useContext(UserContext)
    user: UserContextTypes | undefined
    setUserContext: (user: UserContextTypes | undefined)=>void
    constructor(){
        this.notification = this._notification[0]
        this.setNotification = this._notification[1]
        this.user = this._user[0]
        this.setUserContext = this._user[1]
    }

    logout(){
        this.setUserContext(undefined)
        deleteCookie("Authorization-Token")
        this.router.push(ROUTES_PATHS.sign)
    }

    async CreateUser(user: CreateUserTypes, goToSigninComponent:()=>void){
        const signupUser = await fetch(`/api/user`, {
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify(user)
        })
        if(signupUser.status === 200) goToSigninComponent()
    }

    async AuthenticateUser(user: {password: string, email: string}):Promise<NotificationTypes | undefined>{
        const authUser = await fetch(`/api/user`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify(user)
        })
        if(authUser.status !== 200){
            this.setNotification({message: "Mot de passe incorrect", isSuccess: false, isOpen: true})
            return
        }
        const loggedUser = await authUser.json() as UserContextTypes
        this.setUserContext(loggedUser)
        this.router.push(ROUTES_PATHS.home)
    }

    async UserProfileUpdate(profile: UserProfileTypes | undefined){
        const modifyUser = await fetch(`/api/user/modify`, {
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify(profile)
        })
        if(modifyUser.status !== 200){
            this.setNotification({message: "On n'a pas pu modifier votre compte", isSuccess: false, isOpen: true})
            return
        }
        this.setNotification({message: "Compte modifié", isSuccess: true, isOpen: true})
    }
}