import React from 'react'

import {UserContextTypes} from 'models/User/User.types'

export const ROUTES_PATHS = {
    profile: "/profile",
    create_job: "/profile/create-job",
    account: "/profile/compte",
    job: "/job",
    home: "/",
    sign: "/sign",
    cv: "/profile/cv"
}

export const UserContext = React.createContext<[UserContextTypes | undefined, (user: UserContextTypes | undefined)=> void]>([undefined, ()=>{}])

export const ThemeContext = React.createContext<["light" | "dark", (theme: string)=>void]>(["light", ()=>{}])
