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
    data: T, 
    loading: boolean,
    refetch: (path: string, options?: OptionTypes)=> void
}

type OptionTypes = {
    headers?: HeadersInit | undefined
}

export const useQuerie = <T>(path: string, options?: OptionTypes):QuerieReturn<T>=>{
    const [query, setQuery] = useState<QuerieReturn<any>>({data: undefined, loading: true, refetch: ()=>{}})
    const fetchingData = async (path: string, options?: OptionTypes)=>{
        const fetching = await fetch(`${path}`, {
            headers: options?.headers
        })
        const payload = await fetching.json() as T
        setQuery({data: payload, loading: false, refetch: fetchingData})
    }
    useEffect(()=>{
        fetchingData(path, options)
    },[])

    return query
}