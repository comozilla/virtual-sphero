import keypress from "keypress";
import VirtualSphero from "./main";

const virtualSphero = new VirtualSphero(8081, "*");

// キーにテストする内容を割り当てる
const testKeys = {
  up: ["roll", virtualSphero.getSpeed(), 0],
  right: ["roll", virtualSphero.getSpeed(), 90],
  down: ["roll", virtualSphero.getSpeed(), 180],
  left: ["roll", virtualSphero.getSpeed(), 270],
  space: ["roll", 0, 0],
  r: ["randomColor", null],
  a: function() {
    console.log("set random color");
    const randomColors = ["red", "blue", "yellow", "green", "purple", "orange", "white"];
    commandAll("color", [randomColors[Math.floor(Math.random() * randomColors.length)]]);
  },
  b: function() {
    console.log("add sphero");
    virtualSphero.addSphero(`Sphero${+new Date() + Math.floor(Math.random() * 1000)}`);
  },
  d: function() {
    console.log("remove sphero");
    const spheroNames = virtualSphero.getNames();
    virtualSphero.removeSphero(spheroNames[Math.floor(Math.random() * spheroNames.length)]);
  },
  g: function() {
    console.log(`get sphero names ${virtualSphero.getNames()}`);
  },
  z: function() {
    console.log("rotate sphero");
    commandAll("roll", [0, Math.floor(Math.random() * 361)]);
  }
};

keypress(process.stdin);

process.stdin.on("keypress", function(ch, key) {
  if (key && typeof testKeys[key.name] !== "undefined") {
    if (key && key.shift && key.name === "up" || key && key.shift && key.name === "down") {
      virtualSphero.setSpeed(key.name === "up" ? 1 : -1);
      console.log(`set speed: ${virtualSphero.getSpeed()}`);
    } else if (Array.isArray(testKeys[key.name])) {
      const args = testKeys[key.name];
      console.log(`orb.${args[0]}(${args.slice(1).map(arg => "\"" + arg + "\"").join(", ")});`);
      commandAll(args[0], args.slice(1));
    } else if (typeof testKeys[key.name] === "function") {
      console.log(`${key.name} is assigned to custom function`);
      testKeys[key.name]();
    }
  } else if (key && key.ctrl && key.name === "c") {
    process.exit();
  } else {
    console.log("got \"keypress\"", key);
  }
});

function commandAll(commandName, args) {
  virtualSphero.virtualSpheroNames.forEach(spheroName => {
    virtualSphero.command(spheroName, commandName, args);
  });
}

process.stdin.setRawMode(true);
process.stdin.resume();
