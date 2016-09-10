import http from "http";
import path from "path";
import mime from "mime";
import fs from "fs";
import { server as WebSocketServer } from "websocket";
import express from "express";
import socketIO from "socket.io";
import objectValues from "./util/object-values";

export default class VirtualPlugin {
  constructor(wsPort, allowedOrigin) {
    this.sockets = {};
    this.virtualSpheroNames = [];

    this.app = express();
    this.server = http.Server(this.app);
    this.io = socketIO(this.server);

    this.app.use(express.static("virtual"));
    this.server.listen(wsPort, () => {
      console.log(`[VirtualSphero] ${new Date()} VirtualSphero is listening on port ${wsPort}`);
    });

    this.io.on("connection", socket => {
      socket.on("request", option => {
        this.sockets[socket.id] = {
          socket,
          option
        };
        this.virtualSpheroNames.forEach(spheroName => {
          if (option.showSpheros === null || option.showSpheros.indexOf(spheroName) !== -1) {
            socket.emit("addVirtualSphero", spheroName);
          }
        });
      });
    });
  }

  command(spheroName, commandName, args) {
    objectValues(this.sockets).forEach(socketDetails => {
      socketDetails.socket.emit("command", spheroName, commandName, args);
    });
  }

  addSphero(spheroName) {
    if (this.virtualSpheroNames.indexOf(spheroName) !== -1) {
      return;
    }
    objectValues(this.sockets).forEach(socketDetails => {
     if (socketDetails.option.showSpheros === null || socketDetails.option.showSpheros.indexOf(spheroName) !== -1) {
        socketDetails.socket.emit("addVirtualSphero", spheroName);
      }
      this.virtualSpheroNames.push(spheroName);
    });
  }

  removeSphero(spheroName) {
    if (this.virtualSpheroNames.indexOf(spheroName) === -1) {
      return;
    }
    objectValues(this.sockets).forEach(socketDetails => {
      socketDetails.socket.emit("removeVirtualSphero", spheroName);
    });
    this.virtualSpheroNames.splice(this.virtualSpheroNames.indexOf(spheroName), 1);
  }

  getNames() {
    return this.virtualSpheroNames;
  }
}
