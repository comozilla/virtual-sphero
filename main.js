var http = require("http");
var path = require("path");
var mime = require("mime");
var fs = require("fs");
var WebSocketServer = require("websocket").server;

function VirtualPlugin(wsPort, allowedOrigin) {
  this.directory = __dirname + "/virtual";
  this.wsPort = wsPort;
  this.connections = [];
  this.virtualSpheroNames = [];

  this.httpServer = http.createServer((request, response) => {
    url = request.url === "/" ? "/index.html" : request.url;
    fs.readFile(this.directory + url, function(err, data) {
      if (err) {
        if (err.code === "ENOENT") {
          response.writeHead(404);
          response.write("ファイルが存在しません");
          response.end();
        } else {
          throw err;
        }
      } else {
        response.writeHead(200, {
          "Content-Type": mime.lookup(url)
        });
        response.write(data);
        response.end();
      }
    });
  }).listen(this.wsPort, () => {
    console.log("[VirtualSphero] " + (new Date()) + "VirtualSphero is listening on port " + this.wsPort);
  });

  this.wsServer = new WebSocketServer({
    httpServer: this.httpServer,
    autoAcceptConnections: false
  });

  this.wsServer.on("request", (request) => {
    if (!originIsAllowed(allowedOrigin, request.origin)) {
      request.reject();
      console.log("[VirtualSphero] " + (new Date()) + " Connection from origin " + request.origin + " rejected.");
      return;
    }

    var connection = request.accept(null, request.origin);
    this.connections.push(connection);
    console.log("[VirtualSphero] " + (new Date()) + " Connection from " + request.remoteAddress + " accepted");

    connection.on("message", function(message) {
      console.log("[VirtualSphero] client: " + request.key);
      if (message.type === "utf8") {
        try {
          var data = JSON.parse(message.utf8Data);
        } catch (e) {
          console.error("invalid JSON format");
          return;
        }
      }
    });
    connection.on("close", function(reasonCode, description) {
      console.log("[VirtualSphero] " + (new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
    });
  });
}

VirtualPlugin.prototype.command = function(commandName, args) {
  if (commandName.substring(0, 1) === "_") {
    return;
  }
  sendCommand.call(this, commandName, args);
};

VirtualPlugin.prototype.addSphero = function(spheroName) {
  if (this.virtualSpheroNames.indexOf(spheroName) !== -1) {
    return;
  }
  this.virtualSpheroNames.push(spheroName);
  sendCommand.call(this, "_addVirtualSphero", spheroName);
}

VirtualPlugin.prototype.removeSphero = function(spheroName) {
  sendCommand.call(this, "_removeVirtualSphero", spheroName);
  this.virtualSpheroNames.splice(this.virtualSpheroNames.indexOf(spheroName), 1);
}

VirtualPlugin.prototype.getNames = function() {
  return this.virtualSpheroNames;
}

function originIsAllowed(allowedOrigin, origin) {
  if (allowedOrigin == null || allowedOrigin === "*")
    return true;
  if (allowedOrigin === origin)
    return true;
  if (Array.isArray(allowedOrigin) && allowedOrigin.indexOf(origin) >= 0)
    return true;
  return false;
}

module.exports = VirtualPlugin;

function sendCommand(commandName, args) {
  this.connections.forEach(connection => {
    connection.sendUTF(JSON.stringify({
      command: commandName,
      arguments: args
    }));
  });
}
