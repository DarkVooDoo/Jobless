import { useContext, useEffect, useState } from "react"

import { UserContext } from "utils/contexts"
import { getCookie } from "./Helpers"

export const useAuthUser = ()=>{
    const [_, onUserChange] = useContext(UserContext)

    useEffect(()=>{
        (async ()=>{
            if(!getCookie("Authorization-Token")) return
            const authUser = await fetch(`/api/user`)
            if(authUser.status === 200){
                const user = await authUser.json()
                onUserChange(user)
            }
        })()
    }, [])
}

type QuerieReturn<T> = {
    data: T | undefined, 
    loading: boolean,
    error: {code: number, text: string} | undefined,
    refetch: (path: string, options?: OptionTypes)=> Promise<void>
}

type OptionTypes = {
    headers?: HeadersInit | undefined
}

export const useQuerie = <T>(path: string, options?: OptionTypes):QuerieReturn<T>=>{
    const fetchingData = async (path: string, options?: OptionTypes)=>{
        const fetching = await fetch(`${path}`, {
            headers: options?.headers
        })
        if(fetching.status >= 300) {
            return setQuery({error: {code: fetching.status, text: "Error Fetching"}, loading: false, data: undefined, refetch: fetchingData}) 
        }
        const payload = await fetching.json() as T
        setQuery({data: payload, loading: false, error: undefined, refetch: fetchingData})
    }
    const [query, setQuery] = useState<QuerieReturn<any>>({data: undefined, loading: true, error: undefined, refetch: fetchingData})
    useEffect(()=>{
        fetchingData(path, options)
    },[path])

    return query
}