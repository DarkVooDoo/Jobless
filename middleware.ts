import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES_PATHS } from 'utils/contexts'

export const middleware = async (req:NextRequest)=>{ 
    const res = NextResponse.next()
    const token = req.cookies.get("Authorization-Token")
    if(!token) return NextResponse.redirect(`${process.env.NODE_ENV === "development" ? `http://localhost:3000${ROUTES_PATHS.sign}` : process.env.PROD_BASE_URL+ROUTES_PATHS.sign}`)
    const authUser = await fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000/api/user" : `${process.env.PROD_BASE_URL}/api/user`}`, {
        headers: [["Authorization-Token", token]]
    })
    if(authUser.status === 200) return res
    return NextResponse.redirect(`${process.env.NODE_ENV === "development" ? `http://localhost:3000${ROUTES_PATHS.sign}` : process.env.PROD_BASE_URL+ROUTES_PATHS.sign}`)

}

export const config = {
    matcher: ["/profile/create-job", "/profile", "/profile/compte"],
}