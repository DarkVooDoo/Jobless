import { useRouter } from 'next/router'

import React, { useContext, useState } from 'react'

import { UserContext } from 'utils/contexts'
import { OnInputChangeTypes } from 'utils/types'
import {UserContextTypes} from 'models/User/User.types'

import styles from "styles/Login.module.css"

import SimpleInput from 'components/SimpleInput'
import Notification from 'components/Notification'

import UserController from 'controllers/User.controller'

interface SigninFormProps {
    onSignStateChange: ()=>void
}
const SigninForm:React.FC<SigninFormProps> = ({onSignStateChange })=>{
    const userController = new UserController()

    const [user, setUser] = useState({email: "", password: ""})

    const onSubmitForm:React.FormEventHandler = (ev)=>{
        ev.preventDefault()
        userController.AuthenticateUser(user)
    }

    const onInputChange = ([name, value]:OnInputChangeTypes)=>{setUser(user=>({...user, [name]: value}))}

    return (
        <form className={styles.login} onSubmit={onSubmitForm}>
            <h1 className={styles.login_header}>Connectez-Vous</h1>
            <SimpleInput {...{name: "email", label: "Email", value: user.email, onInputChange, className: "input next_row_margin"}} />
            <SimpleInput {...{name: "password", label: "Mot de passe", type: "password", value: user.password, onInputChange, className: "input next_row_margin"}} />
            <div>
                <b onClick={onSignStateChange}>Creer un nouveau compte</b>
            </div>
            <div className={styles.login_submit}>
                <button className={styles.login_submit_btn} type="submit">Connectez-vous</button>
            </div>
            {userController.notification.isOpen ? <Notification {...{
                ...userController.notification,
                onNotificationEnded: ()=>userController.setNotification(prev=>({...prev, isOpen: false}))}} /> : null}
        </form>

    )
}

export default SigninForm