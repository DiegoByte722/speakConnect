
const app = require("./app");
const http = require("http");
const socketio = require("socket.io");
const sockets = require("./sockets");
const ip= require("ip");
const server = http.createServer(app);
const io = socketio(server);

sockets(io);

server.listen(app.get("port"), () => {
    console.log("Server on port http://localhost:"+ app.get("port"));
    console.log("On your network: http://"+ ip.address() +":"+ app.get("port"));
});

