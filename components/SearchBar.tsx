import React, { ChangeEventHandler, useEffect, useState } from 'react'

import { getCookie } from 'utils/Helpers'
import { OnInputChangeTypes, SearchTypes } from 'utils/types'

import styles from 'styles/SearchBar.module.css'
import ToggleButton from './ToggleButton'
import SimpleInput from './SimpleInput'
import CustomSelect from './CustomSelect'

const CONTRAT_TYPES = ["Tout", "CDD", "CDI", "Interim"]

interface SearchBarProps {
    onSearch: (search: SearchTypes)=> void
}

const SearchBar:React.FC<SearchBarProps> = ({onSearch })=>{
    const [search, setSearch] = useState({search: "", postal: "", contrat: "Tout", fullTime: true, page: "1"})

    useEffect(()=>{
        try{
            const pref = getCookie("SearchPref")
            if(!pref) return
            const {postal, contrat, search} = JSON.parse(pref)
            setSearch(prev=>({...prev, postal, contrat: contrat ? contrat : "Tout", search}))
        }catch(err){}
    },[])

    const onSearchSubmit:React.FormEventHandler = (ev)=>{
        ev.preventDefault()
        onSearch(search)
    }

    const onInputChange = ([name, value]:OnInputChangeTypes)=>{setSearch(prev=>({...prev, [name]: value}))}
    return (
        <div className={styles.container}>
            <form className={`${styles.search}`} onSubmit={onSearchSubmit}>
                <SimpleInput {...{label: "Recherche", name: "search", value: search.search, className: `${styles.search} input`, type: "text", onInputChange}} />
            </form>
            <div className={styles.filters}>
                <SimpleInput {...{label: "Code Postal", name: "postal", value: search.postal, className: `${styles.filters_postal} input`, type: "number", onInputChange}} />
                <div className={styles.filters_fulltime}>
                    <p>Temps plein</p>
                    <ToggleButton {...{state: search.fullTime, onStateChange: (state)=>setSearch(prev=>({...prev, fullTime: state}))}} />
                </div>
                <CustomSelect {...{values: CONTRAT_TYPES, itemSelected: search.contrat, onSelectedChange: (selectedItem)=>setSearch(prev=>({...prev, contrat: selectedItem}))}} />
            </div>
        </div>

    )
}

export default SearchBar