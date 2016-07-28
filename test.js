var keypress = require('keypress');
var VirtualSphero = require("./main");

var virtualSphero = new VirtualSphero(8081, "*");

// キーにテストする内容を割り当てる
var testKeys = {
  up: ["roll", 100, 0],
  right: ["roll", 100, 90],
  down: ["roll", 100, 180],
  left: ["roll", 100, 270],
  space: ["roll", 0, 0],
  r: ["randomColor", null],
  a: function() {
    console.log("set random color");
    var randomColors = ["red", "blue", "yellow", "green", "purple", "orange"];
    virtualSphero.command("color", [randomColors[Math.floor(Math.random() * randomColors.length)]]);
  },
  b: function() {
    console.log("add sphero");
    virtualSphero.addSphero("Sphero" + Math.floor(Math.random() * 500));
  }
}

keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
  if (key && typeof testKeys[key.name] !== "undefined") {
    if (Array.isArray(testKeys[key.name])) {
      var args = testKeys[key.name];
      console.log("orb." + args[0] + "(" + args.slice(1).map(arg => "\"" + arg + "\"").join(", ") + ");");
      virtualSphero.command(args[0], args.slice(1));
    } else if (typeof testKeys[key.name] === "function") {
      console.log(key.name + " is assigned to custom function");
      testKeys[key.name]();
    }
  } else if (key && key.ctrl && key.name === "c") {
    process.exit();
  } else {
    console.log('got "keypress"', key);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

