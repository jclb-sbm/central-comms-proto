const { WebClient, LogLevel } = require("@slack/web-api");
const router = require("express").Router()

// Initialize
const client = new WebClient(process.env.SLACK_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

router.get("/channels", async (req, res) => {
  try {
    const result = await client.conversations.list({
      token: process.env.SLACK_TOKEN
    });

    res.send(result.channels.map(c => {
      return {
        id: c.id,
        name: c.name,
        purpose: c.purpose,
      }
    }))
  } catch (e) {
    res.send(e)
  }
})

router.get("/channel/:channel", async (req, res) => {
  try {
    const { members } = await client.conversations.members({
      token: process.env.SLACK_TOKEN,
      channel: req.params.channel
    })

    const userReqs = []
    members.map((member) => {
      userReqs.push(client.users.info({
        token: process.env.SLACK_TOKEN,
        user: member
      }))
    })
    const users = await Promise.all(userReqs)
    
    let usernames = {} 
    users.map(({ user }) => {
      usernames[user.id] = user.profile.real_name_normalized
    })

    const conversation = await client.conversations.history({
      token: process.env.SLACK_TOKEN,
      channel: req.params.channel
    })

    const resp = conversation.messages.map((message) => {
      return {
        user: usernames[message.user],
        text: message.text,
      }
    })

    res.send(resp)
  } catch (e) {
    res.send(e)
  }
})

router.post("/send-msg", async (req, res) => {
  try {
    const result = await client.chat.postMessage({
      token: process.env.SLACK_TOKEN,
      channel: req.body.channel,
      text: req.body.text,
    });
    res.send(result)
  }
  catch (error) {
    res.send(error)
  }
})

router.post("/event", async (req, res) => {
  // insert web socket event here
  req.app.get('io').emit('new-slack-message', req.body)
  console.log(req.body)
  res.send(req.body.challenge)
})

module.exports = router