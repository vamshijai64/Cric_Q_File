// config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json'); // rename your downloaded key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
