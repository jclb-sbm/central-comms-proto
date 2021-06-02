require('dotenv-flow').config()

const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.post('/sms', (req, res) => {
  console.log(req.body)
  // can save message to DB here

  const twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
