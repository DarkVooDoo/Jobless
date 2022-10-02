import React, { useState } from 'react'
import { OnInputChangeTypes } from 'utils/types'

import SimpleInput from './SimpleInput'
import ToggleButton from './ToggleButton'

import styles from 'styles/Login.module.css'

import UserController from 'controllers/User.controller'

interface SignupFormProps {
    onSignStateChange: ()=>void
}

const SignupForm:React.FC<SignupFormProps> = ({onSignStateChange })=>{
    const userController = new UserController()
    const [isEntreprise, setIsEntreprise] = useState(false)
    const [user, setUser] = useState({
        name: "",
        lastname: "",
        password: "",
        confirmation: "",
        email: "",
        role: 'User'
    })

    const onCreateUser:React.FormEventHandler = (ev)=>{
        ev.preventDefault()
        userController.CreateUser(user, onSignStateChange)
    }

    const onInputChange = ([name, value]:OnInputChangeTypes)=>{setUser(prev=>({...prev, [name]: value}))}

    return (
        <form className={styles.login} onSubmit={onCreateUser}>
            <h1 className={styles.login_header}>Creer un compte</h1>
            {user.role === 'User' && <SimpleInput {...{name: "name", label: "Prenom", value: user.name, onInputChange, className: `input next_row_margin ${styles.first_element}`}} />}
            <SimpleInput {...{name: "lastname", label: "Nom", value: user.lastname, onInputChange, className: "input next_row_margin"}} />
            <SimpleInput {...{name: "email", label: "Email", value: user.email, onInputChange, className: "input next_row_margin"}} />
            <SimpleInput {...{name: "password", label: "Mot de passe", type: "password", value: user.password, onInputChange, className: "input next_row_margin"}} />
            <SimpleInput {...{name: "confirmation", label: "Confirmation", type: "password", value: user.confirmation, onInputChange, className: "input next_row_margin"}} />
            <div className={styles.login_isEntreprise}>
                <p>Etes-Vous une entreprise?</p>
                <ToggleButton {...{state: isEntreprise, onStateChange: (state: any)=>{
                    setUser((user: any)=>({...user, role: state ? 'Pro' : 'User'}))
                    setIsEntreprise(state)
                }}} />
            </div>
            <div>
                <b onClick={onSignStateChange}>Jai déjà un compte</b>
            </div>
            <div className={styles.login_submit}>
                <button className={styles.login_submit_btn} type="submit" >Creer compte</button>
            </div>
        </form>

    )
}

export default SignupForm