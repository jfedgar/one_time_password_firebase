const admin = require('firebase-admin');

module.exports = function(req, res) {
  // verify the user provided a phone
  if (!req.body.phone) {
    return res.status(422).send({ error: "Bad Input" });
  }
  // format the phone number to remove dashes and parens
  const phone = String(req.body.phone).replace(/[^\d]/g, "");
  // create a new user account (using anonymous user firebase) using that phone number
  // respond to the user request saying the account was made
  admin.auth().createUser({ uid: phone })
    .then(user => res.send(user))
    .catch(err => res.status(422).send({ error: err }));
}
