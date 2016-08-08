import http from "http";
import path from "path";
import mime from "mime";
import fs from "fs";
import { server as WebSocketServer }from "websocket";
import express from "express";
import socketIO from "socket.io";

export default class VirtualPlugin {
  constructor(wsPort, allowedOrigin) {
    this.sockets = [];
    this.virtualSpheroNames = [];

    this.app = express();
    this.server = http.Server(this.app);
    this.io = socketIO(this.server);

    this.app.use(express.static("virtual"));
    this.server.listen(wsPort, () => {
      console.log(`[VirtualSphero] ${new Date()} VirtualSphero is listening on port ${wsPort}`);
    });

    this.io.on("connection", socket => {
      this.sockets.push(socket);
      this.virtualSpheroNames.forEach(spheroName => {
        socket.emit("addVirtualSphero", spheroName);
      });
    });
  }

  command(spheroName, commandName, args) {
    this.sockets.forEach(socket => {
      socket.emit("command", spheroName, commandName, args);
    });
  }

  addSphero(spheroName) {
    if (this.virtualSpheroNames.indexOf(spheroName) !== -1) {
      return;
    }
    this.sockets.forEach(socket => {
      socket.emit("addVirtualSphero", spheroName);
    });
    this.virtualSpheroNames.push(spheroName);
  }

  removeSphero(spheroName) {
    if (this.virtualSpheroNames.indexOf(spheroName) === -1) {
      return;
    }
    this.sockets.forEach(socket => {
      socket.emit("removeVirtualSphero", spheroName);
    });
    this.virtualSpheroNames.splice(this.virtualSpheroNames.indexOf(spheroName), 1);
  }

  getNames() {
    return this.virtualSpheroNames;
  }
}
