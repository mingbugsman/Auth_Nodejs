const {model, Schema}  = require('mongoose');

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String, 
        required : true
    },
    name : {
        type : String,
        required : true
    },
    lastLogin : {
        type : Date,
        default : Date.now
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : String,
    resetPasswordExpiresAt : Date,
    verificationToken : String,
    verificationTokenExpiresAt : Date
}, {
    timestamps : true,
    collection : COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, userSchema);