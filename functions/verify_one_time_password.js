const admin = require('firebase-admin');

module.exports = function(req, res) {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: "Phone and code must be provided." });
  }

  const phone = String(req.body.phone).replace(/[^\d]/, '');
  const code = parseInt(req.body.code);

  admin.auth().getUser(phone)
    .then(() => {
      // get a reference to the user's code record in the firebase db
      const ref = admin.database.ref('users/' + phone);

      // if a value exists or is created at that ref in firebase
      ref.on('value', snapshot => {
        ref.off
        const user = snapshot.val();

        // if code does not match or code is no longer valid
        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'Code not valid' });
        }

        // invalidate the code in the db
        ref.update({ codeValid: false });

        // generate json web token and send to user
        admin.auth().createCustomToken(phone)
          .then(token => {
            return res.send({ token: token })
          })
          .catch((err) => {
            return res.status(422).send({ error: err });
          })
        return null;
      });

      return res.status(422).send({ error: "No user found for phone number" });
    })
    .catch((err) => {
      return res.status(422).send({ error: err })
    });
};
