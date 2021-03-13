const {
    codechefHandler,
    codeforcesHandler,
    hackerearthHandler,
} = require("./events");

const { db, callSendAPI } = require('./messenger')

async function sendNotifications(req, res) {
    try {
        let userCollection = await db.collection('users').get()
        let platforms = ['codeforces', 'codechef', 'hackerearth']
        let subscribers = {
            codechef: [], codeforces: [], hackerearth: []
        }
        userCollection.forEach(user => {
            if (user.data().codeforces === true) subscribers.codeforces.push(user.id)
            if (user.data().codechef === true) subscribers.codechef.push(user.id)
            if (user.data().hackerearth === true) subscribers.hackerearth.push(user.id)
        })
    
        let events = {}
        events.codechef = await codechefHandler()
        events.codeforces = await codeforcesHandler()
        events.hackerearth = await hackerearthHandler()
        // res.json(events)
        await platforms.forEach(async (platform) => {
            // console.log(events + '  ppp')
            let message = ''
            if(events[platform][0].Error) message = `No new events on ${platform} today :(`
            else {
                message += `${platform.toUpperCase()} events today:\n\n`;
                events[platform].forEach(event => {
                    message+= `${event.Name}\nEndtime :${event.EndTime}\n${event.url}\n\n`
                })
            }

            subscribers[platform].forEach(async (psid) => {
                await callSendAPI(psid, { text: message })
            })
        })

        res.json({status: 'success'})

    } catch(err) {console.log(err); res.json({error: err})}
}

module.exports = { sendNotifications }