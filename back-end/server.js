const http = require("http");
const app = require("./app");
const constants = {
  serverPort: process.env.PORT || 1000,
};
const port = constants.serverPort;

const server = http.createServer(app);

server.listen(port);
