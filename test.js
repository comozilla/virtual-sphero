var VirtualSphero = require("./main");

var virtualSphero = new VirtualSphero(8081, "*");

setTimeout(function() {
  console.log("roll!");
  virtualSphero.command("roll", [100, 180]);
}, 2000);
