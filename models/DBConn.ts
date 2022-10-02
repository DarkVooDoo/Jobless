import {Pool} from 'pg'

export default new Pool({
    port: process.env.NODE_ENV === "development" ? 5432 : parseInt(process.env.PGPORT!),
    user: process.env.NODE_ENV === "development" ? process.env.DB_USERNAME : process.env.PGUSER,
    password: process.env.NODE_ENV === "development" ? process.env.DB_PASSWORD : process.env.PGPASSWORD,
    database: process.env.NODE_ENV === "development" ? process.env.DB_DATABASE : process.env.PGDATABASE,
    host: process.env.NODE_ENV === "development" ? process.env.DB_HOSTNAME : process.env.PGHOST
})