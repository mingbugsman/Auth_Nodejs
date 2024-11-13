const { MailtrapClient } = require("mailtrap");
require('dotenv').config()
const TOKEN = process.env.MAILTRAPTOKEN;
const ENDPOINT = process.env.MAILTRAPENDPOINT ;


const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint : ENDPOINT
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Trần Tuấn Minh",
};




module.exports = {
    mailtrapClient, sender
}