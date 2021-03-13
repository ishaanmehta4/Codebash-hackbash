require("dotenv").config();
const express = require("express");
const app = express();

const firebase = require("firebase/app");
// const firebaseConfig = require("./firebaseConfig");
// firebase.initializeApp(firebaseConfig);
// require("firebase/firestore");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("static"));

const {
  codechefHandler,
  codeforcesHandler,
  hackerearthHandler,
} = require("./functions/events");
const { reset } = require("nodemon");

app.get("/", (req, res) => {
  console.log("GET /");
  res.json({ status: "active" });
});

app.get("/events/codeforces", async (req, res) => {
  res.send(await codeforcesHandler());
});
app.get("/events/hackerearth", async (req, res) => {
  res.send(await hackerearthHandler());
});
app.get("/events/codechef", async (req, res) => {
  res.send(await codechefHandler());
});

const { webhookPostHandler, webhookGetHandler } = require('./functions/messenger');

app.get("/", (req, res) => {
    console.log('GET /')
    res.json({ 'status': 'active' })
});  

app.post("/mg-api/webhook", webhookPostHandler);
app.get("/mg-api/webhook", webhookGetHandler);


// --- LISTEN TO REQUESTS ---
const listener = app.listen(process.env.PORT || 5000, () => {
  console.log(">> Listening on PORT " + listener.address().port);
});

listener;
