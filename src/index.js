/**
 * NODE JS BOILER PLATE APPLICATION
 */
import { default as config } from "./config";
import express from "express";
import http from "http";
import socketIo from "socket.io";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { boot } from "./boot/index";
import path from "path";
import pug from "pug";
import storage from "node-persist";
import cron from "./core/cron/cron";
import * as mCache from "./core/cache/memory-cache";


const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
const app = boot(server);
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

require("dotenv").config();

console.log("ENVIRONMENT VALUE: ", process.env.ENV_NAME);
console.log("CURRENT PATH VALUE: ", __dirname);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Allow NODE to expose/route the paths
for (var key in config.asset_paths) {
  if (config.asset_paths.hasOwnProperty(key)) {
    app.use(key, express.static(__dirname + config.asset_paths[key]));
  }
}

// Catch unmatched routes
app.all('*', (req, res) => {
  res.json({ status: 404, message: 'Page not found.' });
});

// Must need public/db folder for storage
let storageInit = async () => {
  await storage.init({
    dir: 'public/db',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,  // can also be custom logging function
    ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
    expiredInterval: 60 * 60 * 1000, // every 60 minutes the process will clean-up the expired cache
    // in some cases, you (or some other service) might add non-valid storage files to your
    // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
    forgiveParseErrors: false
  });
  await storage.setItem("didarul", 'the answer to life, the universe, and everything.', { ttl: 1000 * 60 /* 1 min */ });
};
storageInit();

//Start the cron
cron();

// In memory cache
mCache.set('gal_gadot', 'Simple In Memory Cache Example. Can be found at /slideshow');
console.log("N Cache TEST", mCache.get('gal_gadot'));

const socketPort = process.env.SOCKET_PORT ? parseInt(process.env.SOCKET_PORT, 10): 4001;
const serverPort = process.env.PORT ? parseInt(process.env.PORT, 10): 4000;

app.listen(serverPort, () => {
  console.log(`server started on: ${serverPort}`);
});

// This is what the socket.io syntax is like, we will work this later
io.on("connection", (socket) => {
  console.log("Socket: New Client Connected");

  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on("sky_comm", (incomngMSG) => {
    // once we get a 'rock_comm' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above

    console.log("sky_comm to: ", incomngMSG);
    socket.emit("sky_comm", "Socket Server: I am sending you a message");
  });

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("Socket: User Disconnected");
  });
});

httpServer.listen(socketPort, () => {
  console.log(`Socket Started On  ${socketPort}`);
});
