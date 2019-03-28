const twilio = require('twilio');
const credentials = require('./twilio.json');

const accountSid = credentials.accountSid;
const authToken = credentials.authToken;

module.exports = new twilio.Twilio(accountSid, authToken);
