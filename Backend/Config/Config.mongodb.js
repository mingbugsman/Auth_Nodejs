'use strict'

const dev = {
    app : {
        port : process.env.PORT
    },
    db : {
        host : process.env.DEV_DB_HOST,
        port : process.env.DEV_DB_PORT,
        name : process.env.DEV_DB_NAME
    }
}

const config = {dev};
const env = process.env.NODE_ENV || 'dev'



module.exports = config[env];