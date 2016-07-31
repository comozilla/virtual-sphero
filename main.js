var http = require("http");
var path = require("path");
var mime = require("mime");
var fs = require("fs");
var WebSocketServer = require("websocket").server;
var express = require("express");
var socketIO = require("socket.io");

function VirtualPlugin(wsPort, allowedOrigin) {
  this.sockets = [];
  this.virtualSpheroNames = [];

  this.app = express();
  this.server = http.Server(this.app);
  this.io = socketIO(this.server);

  this.app.use(express.static("virtual"));
  this.server.listen(wsPort, () => {
    console.log("[VirtualSphero] " + (new Date()) + "VirtualSphero is listening on port " + wsPort);
  });

  this.io.on("connection", socket => {
    this.sockets.push(socket);
    this.virtualSpheroNames.forEach(spheroName => {
      socket.emit("addVirtualSphero", spheroName);
    });
  });
}

VirtualPlugin.prototype.command = function(commandName, args) {
  this.sockets.forEach(socket => {
    socket.emit("command", commandName, args);
  });
};

VirtualPlugin.prototype.addSphero = function(spheroName) {
  if (this.virtualSpheroNames.indexOf(spheroName) !== -1) {
    return;
  }
  this.sockets.forEach(socket => {
    socket.emit("addVirtualSphero", spheroName);
  });
  this.virtualSpheroNames.push(spheroName);
}

VirtualPlugin.prototype.removeSphero = function(spheroName) {
  if (this.virtualSpheroNames.indexOf(spheroName) === -1) {
    return;
  }
  this.sockets.forEach(socket => {
    socket.emit("removeVirtualSphero", spheroName);
  });
  this.virtualSpheroNames.splice(this.virtualSpheroNames.indexOf(spheroName), 1);
}

VirtualPlugin.prototype.getNames = function() {
  return this.virtualSpheroNames;
}

module.exports = VirtualPlugin;
