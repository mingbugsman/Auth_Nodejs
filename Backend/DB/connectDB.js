const mongoose = require('mongoose');
const { db : {host,name,port} } = require('../Config/Config.mongodb.js');
const connectionString =
            `mongodb://${host}:${port}/${name}`;


class Database {
    constructor() {
        this.connect();
    }
    connect(type= 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug',true);
            mongoose.set('debug', {color : true});
        }
        mongoose.connect(connectionString, {maxPoolSize : 50})
        .then(_ => console.log(`connect mongodb success with db name ${name}`))
        .catch(err => console.log(`error connect !`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;