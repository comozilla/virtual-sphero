var http = require("http");
var path = require("path");
var mime = require("mime");
var fs = require("fs");

function VirtualPlugin(wsPort) {
  this.directory = __dirname + "/virtual";
  this.wsPort = wsPort;
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
    console.log((new Date()) + " VirtualSphero Server is listening on port " + this.wsPort);
  });
}

VirtualPlugin.prototype.command = function(commandName, args) {

}

module.exports = VirtualPlugin;

