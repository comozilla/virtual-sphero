var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

var VirtualSpheroController = (function() {
  var SpeedController = (function() {
    function SpeedController() {
      this._element = document.getElementById("speed");
      this.speed = 0.2;
      this._element.value = this.speed;
      this._element.addEventListener("change", () => {
        if (this._element.value !== "" && !isNaN(this._element.value)) {
          this.speed = parseFloat(this._element.value);
        }
      });
    };
    return SpeedController;
  })();
  function VirtualSpheroController() {
    var showParam = getParams().show;
    this.showSpheros = typeof showParam === "undefined" ? null : showParam.split(",");
    this.socket = io();

    this.socket.on("addVirtualSphero", spheroName => {
      this.addVirtualSphero(spheroName);
    });

    this.socket.on("removeVirtualSphero", spheroName => {
      this.removeVirtualSphero(spheroName);
    });

    this.socket.on("command", (commandName, args) => {
      Object.keys(this.virtualSpheros).forEach(virtualSpheroName => {
        var virtualSphero = this.virtualSpheros[virtualSpheroName];
        if (commandName === "roll") {
          var direction = args[1] - 90;
          var x = Math.cos(direction * Math.PI / 180) * 0.1;
          var y = Math.sin(direction * Math.PI / 180) * 0.1;
          Matter.Body.applyForce(virtualSphero, { x: 0, y: 0 }, { x: x, y: y });
        }
        // if (typeof virtualSphero[commandName] !== "undefined") {
        //   virtualSphero[commandName].apply(virtualSphero, args);
        // }
      });
    });

    this.speedController = new SpeedController();

    this.engine = Engine.create();
    this.engine.world.gravity.y = 0;

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    var ground1 = Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
    var ground2 = Bodies.rectangle(10, 300, 20, 600, { isStatic: true });
    var ground3 = Bodies.rectangle(400, 10, 800, 20, { isStatic: true });
    var ground4 = Bodies.rectangle(790, 300, 20, 600, { isStatic: true });

    World.add(this.engine.world, [ground1, ground2, ground3, ground4]);
    Engine.run(this.engine);

    var tick = () => {
      this.clearCanvas();
      Object.keys(this.virtualSpheros).forEach(spheroName => {
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    this.virtualSpheros = {};
  }

  VirtualSpheroController.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  VirtualSpheroController.prototype.addVirtualSphero = function(spheroName) {
    if (this.showSpheros === null || this.showSpheros.indexOf(spheroName) !== -1) {
      this.virtualSpheros[spheroName] = Bodies.circle(400, 400, 30, {
        friction: 0.1
      });
      World.add(this.engine.world, [this.virtualSpheros[spheroName]]);
    }
  };

  VirtualSpheroController.prototype.removeVirtualSphero = function(spheroName) {
    if (typeof this.virtualSpheros[spheroName] !== "undefined") {
      delete this.virtualSpheros[spheroName];
    }
  };

  var commands = [
    /* sphero.js */
    "setHeading",
    "setStabilization",
    "setRotationRate",
    "setCreationDate",
    "getBallRegWebsite",
    "reEnableDemo",
    "getChassisId",
    "setChassisId",
    "selfLevel",
    "setVdl",
    "setDataStreaming",
    "setCollisionDetection",
    "locator",
    "setAccelerometer",
    "readLocator",
    "setRgbLed",
    "setBackLed",
    "getRgbLed",
    "roll",
    "boost",
    "move",
    "setRawMotors",
    "setMotionTimeout",
    "setOptionsFlag",
    "getOptionsFlag",
    "setTempOptionFlags",
    "getTempOptionFlags",
    "getConfigBlock",
    "setSsbParams",
    "setDeviceMode",
    "setConfigBlock",
    "getDeviceMode",
    "getSsb",
    "setSsb",
    "ssbRefill",
    "ssbBuy",
    "ssbUseConsumeable",
    "ssbGrantCores",
    "ssbAddXp",
    "ssbLevelUpAttr",
    "getPwSeed",
    "ssbEnableAsync",
    "runMacro",
    "saveTempMacro",
    "saveMacro",
    "initMacroExecutive",
    "abortMacro",
    "macroStatus",
    "setMacroParam",
    "appendTempMacroChunk",
    "eraseOBStorage",
    "appendOBFragment",
    "execOBProgram",
    "abortOBProgram",
    "answerInput",
    "commitToFlash",
    "commitToFlashAlias",
    /* custom.js */
    "streamData",
    "color",
    "randomColor",
    "getColor",
    "detectCollisions",
    "startCalibration",
    "finishCalibration",
    "streamOdometer",
    "streamVelocity",
    "streamAccelOne",
    "streamImuAngles",
    "streamAccelerometer",
    "streamGyroscope",
    "streamMotorsBackEmf",
    "stopOnDisconnect",
    "stop"
  ];
  return VirtualSpheroController;
})();

document.addEventListener("DOMContentLoaded", function() {
  var sphero = new VirtualSpheroController();
  window.addEventListener("resize", function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.clearCanvas();
    virtualSphero.draw();
  });
});

function getParams() {
  var paramsObject = {};
  location.search.substring(1).split("&").forEach(keyValuePair => {
    var keyAndValue = keyValuePair.split("=");
    paramsObject[keyAndValue[0]] = keyAndValue[1];
  });
  return paramsObject;
}

