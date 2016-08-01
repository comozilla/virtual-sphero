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
    function Grounds(width, height, engine) {
      this.engine = engine;
      this.walls = {};
      this.setSize(width, height);
    };

    Grounds.prototype.refreshWalls = function() {
      ["top", "right", "bottom", "left"].forEach(wallType => {
        refreshWall.call(this, wallType);
      });
    };

    Grounds.prototype.setSize = function(width, height) {
      this.width = width;
      this.height = height;
      this.refreshWalls();
    };

    function getRect(groundType) {
      var thickness = 100;
      var positions = {
        top: { x: this.width / 2, y: -(thickness / 2), width: this.width, height: thickness },
        right: { x: this.width + thickness / 2, y : this.height / 2, width: thickness, height: this.height },
        bottom: { x: this.width / 2, y: this.height + thickness / 2, width: this.width, height: thickness },
        left: { x: -(thickness / 2), y: this.height / 2, width: thickness, height: this.height }
      };
      if (typeof positions[groundType] === "undefined") {
        throw new Error("groundTypeが正しくありません。");
      }
      return positions[groundType];
    };

    function refreshWall(wallType) {
      var rect = getRect.call(this, wallType);
      var wallName = "ground" + wallType.charAt(0).toUpperCase() + wallType.slice(1);
      if (typeof this.walls[wallType] === "undefined") {
        var wall = Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: true });
        wall.restitution = 0;
        World.add(this.engine.world, wall);
        this.walls[wallType] = {
          body: wall,
          defaultWidth: rect.width,
          defaultHeight: rect.height
        };
      } else {
        var wall = this.walls[wallType];
        Body.setPosition(wall.body, { x: rect.x, y: rect.y });
        Body.scale(wall.body, rect.width / wall.defaultWidth, rect.height / wall.defaultHeight);
      }
    }

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

    this.socket.on("command", (spheroName, commandName, args) => {
      var virtualSphero = this.virtualSpheros[spheroName];
      if (typeof virtualSphero !== "undefined" &&
          typeof virtualSphero[commandName] !== "undefined") {
        virtualSphero[commandName].apply(virtualSphero, args);
      }
    });

    this.speedController = new SpeedController();

    this.engine = Engine.create();
    this.engine.world.gravity.y = 0;

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.grounds = new Grounds(this.canvas.width, this.canvas.height, this.engine);
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
    this.grounds.setSize(this.canvas.width, this.canvas.height);
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
    sphero.clearCanvas();
    sphero.resetGrounds();
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
