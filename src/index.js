require('dotenv-flow').config();

const http = require('http');
const app = require("./app.js")

http.createServer(app).listen(process.env.PORT, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
});