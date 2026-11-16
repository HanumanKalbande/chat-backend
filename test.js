const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'past_db_URL'
});
const app = express();
const port = 3000;
// Middleware
app.use(bodyParser.json());
// Get a reference to the Firebase Realtime Database
const db = admin.database();
// Endpoint to send a new message
app.post('/send', (req, res) => {
  const { user, message } = req.body;
  const messageRef = db.ref('messages').push();
  messageRef.set({
    user,
    message,
    timestamp: Date.now()
  }).then(() => {
    res.status(200).send('Message sent!');
  }).catch((error) => {
    res.status(500).send(`Error sending message: ${error.message}`);
  });
});
// Endpoint to get all messages
app.get('/messages', (req, res) => {
  db.ref('33d9d195-8191-4a11-8f9d-192edc383da1').once('value').then((snapshot) => {
    res.status(200).json(snapshot.val());
  }).catch((error) => {
    res.status(500).send(`Error fetching messages: ${error.message}`);
  });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});