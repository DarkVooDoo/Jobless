export type PoleEmploiPayloadTypes = {
    id: string,
    intitule: string,
    description: string,
    dateCreation: string,
    typeContrat: string,
    entreprise: {nom: string}
    dureeTravailLibelle: string,
    salaire: {libelle: string}
    contact: {urlPostulation: string},
    origineOffre: {urlOrigine: string}
    lieuTravail: {libelle: string, codePostal: string}
}

export type CreateJobTypes = {
    title: string,
    description: string,
    contrat: string,
    time: string,
    salary: string,
    places: string,
    fullTime: boolean,
    city: string,
    categorie: string,
    postal: string,
    tags: string[],
    postulationUrl: string,
    user_id: string
}

export interface JobPayloadTypes extends JobCardTypes {
    job_entreprise: string,
    job_hours: string;
    job_contrat: string;
    job_description: string;
    job_postulation: string;
    job_user_id: string | null
}

export type JobCardTypes = {
    job_id: string,
    job_name: string,
    job_created: string,
    job_salary: string,
    job_from: "Pole Emploi" | null,
    job_city: string,
    job_postal: string
}