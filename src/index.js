require('dotenv-flow').config();

const app = require("./app.js")
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.set('io', io)

io.on('connection', socket => {
  console.log('connected')
})

httpServer.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})