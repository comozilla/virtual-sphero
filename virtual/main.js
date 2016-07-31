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
  var Grounds = (function() {
    function Grounds() {
      this.ground1;
      this.ground2;
      this.ground3;
      this.ground4;
    };

    Grounds.prototype.add = function(width, height, engine) {
      console.log(width+" "+height);
      this.ground1 = Bodies.rectangle(width / 2, height + 10, width, 5, { isStatic: true });
      this.ground1.restitution = 0;
      this.ground2 = Bodies.rectangle(-10, height / 2, 5, height, { isStatic: true });
      this.ground2.restitution = 0;
      this.ground3 = Bodies.rectangle(width / 2, -10, width, 5, { isStatic: true });
      this.ground3.restitution = 0;
      this.ground4 = Bodies.rectangle(width + 10, height / 2, 5, height, { isStatic: true });
      this.ground4.restitution = 0;
      World.add(engine.world, [this.ground1, this.ground2, this.ground3, this.ground4]);
    };

    Grounds.prototype.remove = function(engine) {
      World.remove(engine.world, [this.ground1, this.ground2, this.ground3, this.ground4].body);
    };

    return Grounds;
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
        if (typeof virtualSphero[commandName] !== "undefined") {
          virtualSphero[commandName].apply(virtualSphero, args);
        }
      });
    });

    this.speedController = new SpeedController();

    this.engine = Engine.create();
    this.engine.world.gravity.y = 0;

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.grounds = new Grounds();
    this.grounds.add(this.canvas.width, this.canvas.height, this.engine);

    Engine.run(this.engine);

    var tick = () => {
      this.clearCanvas();
      Object.keys(this.virtualSpheros).forEach(spheroName => {
        this.virtualSpheros[spheroName].move();
        this.virtualSpheros[spheroName].draw();
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    this.virtualSpheros = {};
  }

  VirtualSpheroController.prototype.resetGrounds = function() {
    this.grounds.remove(this.engine);
    this.grounds.add(this.canvas.width, this.canvas.height, this.engine);
  };

  VirtualSpheroController.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  VirtualSpheroController.prototype.addVirtualSphero = function(spheroName) {
    if (this.showSpheros === null || this.showSpheros.indexOf(spheroName) !== -1) {
      this.virtualSpheros[spheroName] = new VirtualSphero(this.canvas, this.speedController, spheroName);
      World.add(this.engine.world, this.virtualSpheros[spheroName].body);
    }
  };

  VirtualSpheroController.prototype.removeVirtualSphero = function(spheroName) {
    if (typeof this.virtualSpheros[spheroName] !== "undefined") {
      World.remove(this.engine.world, this.virtualSpheros[spheroName].body);
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
    this.resetGrounds();
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
