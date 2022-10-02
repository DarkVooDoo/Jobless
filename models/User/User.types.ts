export type CreateUserTypes = {
    name: string,
    lastname: string,
    password: string,
    email: string,
    role: string
}

export type AuthenticateUserTypes = {
    email: string,
    password: string
}

export type UserContextTypes = {
    id: string, 
    name: string,
    role: string,
    photo: string | null
}

export type ApplicationCardTypes = {
    application_id: string, 
    application_date: string,
    application_seen: boolean,
    job_name: string, 
    job_city: string, 
    job_postal: string, 
    job_salary: string, 
    job_date: string
}

export type UserProfileTypes = {
    user_id: string,
    user_name: string,
    user_lastname: string,
    user_photo: string | null | undefined,
    user_email: string,
    user_joined: string,
    user_postal: string,
    user_adresse: string,
    user_role: "Admin" | "Pro" | "User",
    user_city: string,
    user_coord: string[],
    applications: ApplicationCardTypes[]
}

export type UserApplicationTypes = {
    application_id: string,
    application_date: string,
    application_cv: string,
    application_email: string,
    application_nom: string,
    application_prenom: string,
    application_seen: boolean,
    job_id: string,
    job_name: string,
    job_salary: string,
    job_city: string,
    job_postal: string
}

export type JobApplicationTypes = {

}