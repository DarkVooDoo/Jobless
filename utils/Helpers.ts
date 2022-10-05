import { JobCardTypes } from "models/Job/Job.types"
import { ObjectOnlyTypes, PostgresAgeTypes } from "./types"

export const getCookie = (cookieName: string)=>{
    const cookies = document.cookie.split(";")
    let objectCookies:{[key: string]: string | undefined} = {}
    cookies.forEach(item=>{
        const keyValues = item.trim().split("=")
        objectCookies = {...objectCookies, [keyValues[0]]: keyValues[1]}
    })
    return objectCookies[cookieName]
}

export const createCookie = (cookieName: string, value: string, maxAge: number)=>{
    document.cookie = `${cookieName}=${value};Path=/;SameSite=Strict;Max-Age=${maxAge}`
}

export const deleteCookie = (cookieName: string)=>{
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const postgresAgeToString = ({years, months, days, hours, minutes, seconds}: PostgresAgeTypes)=>{
    return years ? `Il y a ${years} Ans` : months ? `Il y a ${months} Mois` : days ? `Il y a ${days} Jours` : hours ? `Il y a ${hours} Heures` : minutes ? `Il y a ${minutes} Minutes` : `Il y a ${seconds} Secondes`
}

export const sortedJobs = (...args:JobCardTypes[]):JobCardTypes[]=>{
    const sortedJobs:JobCardTypes[] = args.sort((a, b)=>{
        const aDate = new Date(a.job_created)
        const bDate:Date = new Date(b.job_created)
        return bDate.getTime() - aDate.getTime()
    }).map(item=>{
        const job_created = GetTimeDifferential(new Date(item.job_created).getTime())
        return {...item, job_created}
    })
    return sortedJobs
}

export const stringToHtml = (payload: string)=>{
    let html = ""
    payload.split("\n").forEach(item=>{html += `${item} <br/>`})
    return html
}

export const GetTimeDifferential = (oldDate: number):string=>{
    const today = Date.now() + Math.abs(new Date().getTimezoneOffset() * (1000 * 60))
    const diff = today - oldDate

    const isSeconds = diff < 1000*60 && diff > 1000
    const isMinutes = diff > 1000*60 && diff < 1000*60*60
    const isHours = diff > 1000*60*60 && diff < 1000*60*60*24
    const isDays = diff > 1000*60*60*24 && diff < 1000*60*60*24*30
    const isMonths = diff > 1000*60*60*24*30 && diff < 1000*60*60*24*30*365

    if(isSeconds){
        return `Il y a ${Math.floor(diff / 1000)} Secondes`
    }else if(isMinutes){
        return `Il y a ${Math.floor(diff / (1000*60))} Minutes`
    }else if(isHours){
        return `Il y a ${Math.floor(diff / (1000*60*60))} Heures`
    }else if(isDays){
        return `Il y a ${Math.floor(diff / (1000*60*60*24))} Jours`
    }else if(isMonths){
        return `Il y a ${Math.floor(diff / (1000*60*60*24*30))} Mois`
    }else{
        return `Il y a ${Math.floor(diff / 1000*60*60*24*30*365)} Ans`
    }

}

export const ObjectHasChange = <T extends ObjectOnlyTypes>(_firstObject: T, _objectToCompare: T):boolean=>{
    const firstObject = Object.entries(_firstObject)
    const objectToCompare:{[key: string]: string | string[]} = Object.create(_objectToCompare)
    for(let [key, firstObjectValue] of firstObject){
        const compareTo = objectToCompare[key]
        if(!firstObjectValue && compareTo) return true
        else if(typeof compareTo === "string" && typeof firstObjectValue === "string" && compareTo.toLowerCase() !== firstObjectValue.toLowerCase()) return true
        else if(Array.isArray(firstObjectValue)){
            let x = 0
            for(let value of firstObjectValue){
                if(value !== compareTo[x]) return true
                x++  
            }
            return false
        }
    }
    return false
}
