
export type OnInputChangeTypes = [name: string, value: string]

export type SearchTypes = {
    search: string,
    postal: string,
    contrat: string,
    page: string,
    fullTime: boolean
}

export type SearchAdresseType = {
    properties: {city: string, postcode: string, name: string}, 
    geometry: {coordinates: string[]}
}

export type PostgresAgeTypes = {
    [key: string]: string | null,
}

export type SelectedAdresseTypes = {
    user_city: string, 
    user_adresse: string, 
    user_coord: string[], 
    user_postal: string
}

export type NotificationTypes = {
    message: string;
    isSuccess: boolean;
    isOpen: boolean;
}
export interface ObjectOnlyTypes {
    [key: string]: string | number | boolean | undefined | null | any[] 
}