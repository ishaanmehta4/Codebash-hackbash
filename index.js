require('dotenv').config()
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static("static"));

const { codechefHandler, codeforcesHandler, hackerearthHandler } = require('./functions/events');
const { webhookPostHandler, webhookGetHandler } = require('./functions/messenger');

app.get("/", (req, res) => {
    console.log('GET /')
    res.json({ 'status': 'active' })
});  

app.post("/mg-api/webhook", webhookPostHandler);
app.get("/mg-api/webhook", webhookGetHandler);

app.get('/events/codechef', codechefHandler)
app.get('/events/hackerearth', hackerearthHandler)
app.get('/events/codeforces', codeforcesHandler)

// --- LISTEN TO REQUESTS ---
const listener = app.listen(process.env.PORT || 5000, () => {
    console.log(">> Listening on PORT " + listener.address().port);
  });


