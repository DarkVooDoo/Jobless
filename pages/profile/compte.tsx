import {NextPage} from 'next'
import Head from 'next/head'

import { CSSProperties, useEffect, useState } from 'react'

import { getCookie, ObjectHasChange } from 'utils/Helpers'
import { OnInputChangeTypes, SearchAdresseType } from 'utils/types'
import {UserProfileTypes} from 'models/User/User.types'

import SimpleInput from 'components/SimpleInput'
import { DropdownList } from 'components/Dropdown'
import Notification from 'components/Notification'

import UserController from 'controllers/User.controller'
import Loading from 'components/Loading'

let adresseTimeout: NodeJS.Timeout
let profileObject: UserProfileTypes

const Compte:NextPage = ({ })=>{
    const userController = new UserController()

    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfileTypes>()
    const [photo, setPhoto] = useState<string | undefined>()
    const [profileHasChange, setProfileHasChange] = useState(false)
    const [suggestedAdresse, setSuggestedAdresse] = useState<{
        properties: {
            city: string;
            postcode: string;
            name: string;
        };
        geometry: {
            coordinates: string[];
        };
    }[]>([])

    const onInputChange = ([name, value]:OnInputChangeTypes)=>{
        setProfile(prev=>prev ? {...prev, [name]: value} : undefined)
        profile && setProfileHasChange(ObjectHasChange<UserProfileTypes>(profileObject, {...profile, [name]: value}))
    }

    const onSearchAdresse = ()=>{
        clearTimeout(adresseTimeout)
        adresseTimeout = setTimeout(async()=>{
            if(profile?.user_adresse){
                const fetchAdresse = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${profile?.user_adresse}&limit=5`)
                const adresses = await fetchAdresse.json() as {features: SearchAdresseType[]}
                setSuggestedAdresse(adresses.features)
            }
        },  500)
    }

    const onSelect = (adresse: string)=>{
        const [_adresse, postal, city] = adresse.split(",")
        setProfile(prev=> prev ? ({...prev, user_postal: postal.trim(), user_city: city.trim(), user_adresse: _adresse}) : undefined)
        setSuggestedAdresse([])
    }

    const onAvatarChange:React.ChangeEventHandler<HTMLInputElement> = ({currentTarget:{files}})=>{
        const fileReader = new FileReader()
        const file = files?.item(0)
        if(file){
            fileReader.onloadend = (ev)=>{
                const fileString = ev.target?.result?.toString()
                profile ? setPhoto(fileString) : null
            }
            fileReader.readAsDataURL(file)
        }
    }

    useEffect(()=>{
        (async ()=>{
            const fetchProfile = await fetch(`/api/user/get`, {
                headers: [["Authorization-Token", getCookie("Authorization-Token") ?? ""]]
            })
            const compte = await fetchProfile.json() as UserProfileTypes
            setProfile(compte)
            profileObject = compte
            setLoading(false)
        })()
    },[])

    const adresseArray = suggestedAdresse.map(item=>`${item.properties.name}, ${item.properties.postcode}, ${item.properties.city}`)

    if(!loading){
        return (
            <>
                <Head>
                    <title>Compte</title>
                </Head>
                <div>
                    <h1 style={{margin: "var(--Mobile-Element-Bottom-Margin) 0", textAlign: "center"}}>Votre Compte</h1>
                    <div style={styles.profile_photo}>
                        <div style={styles.profile_photo_box}>
                            <input type="file" name="avatar" id="avatar" accept='image/*' style={{display: "none"}} onChange={onAvatarChange} />
                            <label htmlFor="avatar" style={styles.profile_photo_box_input} />
                            {photo && <img src={photo} alt="user photo" style={styles.avatar} />}
                        </div>
                    </div>
                    {userController.user?.role === "User" && <SimpleInput {...{onInputChange, value: profile?.user_name ? profile.user_name : "", name: "user_name", label: "Prenom", className: "input next_row_margin"}} />}
                    <SimpleInput {...{onInputChange, value: profile?.user_lastname ? profile.user_lastname : "", name: "user_lastname", label: "Nom", className: "input next_row_margin"}} />
                    
                    <div className='input next_row_margin'>
                        <input type="text" name="user_adresse" id="user_adresse" className='form_input' value={profile?.user_adresse ?? ""} 
                        onChange={({currentTarget: {name, value}})=>onInputChange([name, value])} 
                        onKeyDown={onSearchAdresse} />
                        <label htmlFor="user_adresse" className='form_label'>Adresse</label>
                        {suggestedAdresse.length > 0 && 
                        <DropdownList {...{values: adresseArray, onSelect}}/>}
                    </div>
                    <div className='next_row_margin' style={{display: "flex", gap: "1rem"}}>
                        <SimpleInput {...{onInputChange, value: profile?.user_city ? profile.user_city : "", name: "user_city", label: "City", className: "input half"}} />
                        <SimpleInput {...{onInputChange, value: profile?.user_postal ? profile.user_postal : "", name: "user_postal",label: "Postal", className: "input half"}} />
                    </div>
                    {profileHasChange && <div>
                        <button style={styles.submitBtn} onClick={()=>{
                            userController.UserProfileUpdate(profile)
                            if(profile && userController.notification.isSuccess) {
                                profileObject = profile
                                setProfileHasChange(false)
                            }
                        }}>Enregistrer</button>
                    </div>}
                    {userController.notification.isOpen && <Notification {...{
                        ...userController.notification,
                        onNotificationEnded: ()=>userController.setNotification(prev=>({...prev, isOpen: false}))}} />}
                </div>
    
            </>
        )
    }
    return (
        <Loading />
    )
}

const styles:{[key: string]:CSSProperties} = {
    profile_photo:{
        display: "flex",
        justifyContent: "center"
    },
    profile_photo_box:{
        position: "relative",
        width: "6rem",
        height: "6rem",
        borderRadius: "50%",
        backgroundColor: "#E2E2E2",
        marginBottom: "var(--Mobile-Element-Bottom-Margin)"
    },
    profile_photo_box_input:{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    avatar:{
        width: "100%",
        height: "100%",
        borderRadius: "50%"
    },
    submitBtn:{
        padding: ".8rem",
        backgroundColor: "var(--Primary-Color)",
        borderRadius: "5px"
    }
}

export default Compte