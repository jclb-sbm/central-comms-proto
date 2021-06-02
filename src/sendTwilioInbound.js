require('dotenv-flow').config()

require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
  .messages
  .create({
    body: 'HI RAVEEEEEEEE, FROM TWILIOOOO',
    from: process.env.TWILIO_NUMBER,
    to: '+639474894053',
  })
  .then(message => console.log(message.sid))
  .catch(e => console.log(e))