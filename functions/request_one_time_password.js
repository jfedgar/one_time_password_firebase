const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: 'You must provide a phone number.' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/, '');

  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor(Math.random() * 8999 + 1000)

      // send user a text message with the code
      twilio.messages.create( {
        to: phone,
        from: '+14404343708',
        body: `Your code is ${code}`
      }, (err) => {
        // err is not defined if it was successful
        if (err) { return res.status(422).send({ error: err }); }

        // if successfully sent (which also validates the user's phone number),
        //  save code in firebase and associate with user
        admin.database().ref('users/' + phone)
          .update({ code, codeValid: true }, () => {
            return res.send({ success: true });
          })
      });
      return res.status(422).send({ error: "unknown error sending code" })
    })
    .catch(err => {
      res.status(422).send({ error: err })
    })
};
