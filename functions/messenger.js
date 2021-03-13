const firebase = require("firebase/app");
const firebaseConfig = require('../firebaseConfig')
firebase.initializeApp(firebaseConfig);
require("firebase/firestore");
const db = firebase.firestore();

const request = require('request')
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


// Accepts POST requests at the /webhook endpoint
const webhookPostHandler = async (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === "page") {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            // console.log("Sender ID: " + sender_psid);

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
}

// Accepts GET requests at the /webhook endpoint
const webhookGetHandler = async (req, res) => {
    /** UPDATE YOUR VERIFY TOKEN **/
    const VERIFY_TOKEN = PAGE_ACCESS_TOKEN;
    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode were sent
    if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Respond with 200 OK and challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

async function handleMessage(sender_psid, received_message) {
    let response;
    console.log(received_message)

    // Checks if the message contains text
    if (received_message.text) {
        console.log(`Recieved text: "${received_message.text}" from ${sender_psid}`);

        let replyText = '';
        if (received_message.text.toLowerCase()) replyText = await frameMessengerReply(sender_psid, received_message.text.toLowerCase(), false);
        response = {
            text: replyText
        };
    }
    if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        // console.log(attachment_url + ' received from ' + sender_psid);
        let replyText = await frameMessengerReply(sender_psid, attachment_url, true);
        response = {
            text: replyText
        };
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === "yes") {
        response = { text: "Thanks!" };
    } else if (payload === "no") {
        response = { text: "Oops, try sending another image." };
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid
        },
        message: response
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: "https://graph.facebook.com/v2.6/me/messages",
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: "POST",
            json: request_body
        },
        (err, res, body) => {
            if (!err) {
                console.log("Message sent!");
            } else {
                console.error("Unable to send message: " + err);
            }
        }
    );
}


async function frameMessengerReply(user_psid, msgText, isAttachment) //Handles messages recieved on Messenger
{
    try {
        if(msgText.slice(0,4) == 'join') {
            let responseText = await joinResponse(user_psid)
            return responseText
        }
        console.log(msgText.slice(0,4))
        
        
        
        
        return 'Unhandled'
    } catch(err) {console.log(err); return 'Oops! some error occurred.'}
}

async function joinResponse(user_psid) {
    try {
        // let userDoc = await db.collection('users').document(user_psid).get()
        // if(!userDoc.exists()) userDoc.ref.set({
        //     codeforces: 'pending', hackerearth: 'pending', codechef: 'pending'
        // })
        return 'Joining'
    } catch(err) {console.log(err); return 'Oops! some error occurred.'}
}

module.exports = { webhookGetHandler, webhookPostHandler }