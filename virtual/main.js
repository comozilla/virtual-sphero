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
<<<<<<< 400798a4460180512b86a4458b95e7fa925c1c16
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
=======
    this.ws = new WebSocket("ws://" + location.host);

    this.ws.onclose = function() {
        this.ws = null;
    }.bind(this);

    this.ws.onerror = function(e) {
        if (typeof errorCallback === "function")
            errorCallback(e);
    };

    this.ws.onmessage = function(message) {
      console.log(message.data);
      var data;
      try {
        data = JSON.parse(message.data);
      } catch(e) {
        console.log(e);
        return;
      }
      if (data.command.substring(0, 1) === "_") {
        console.log(data.command);
        switch (data.command) {
          case "_addVirtualSphero":
            this.addVirtualSphero(data.arguments);
            break;
          case "_removeVirtualSphero":
            this.removeVirtualSphero(data.arguments);
            break;
          }
        } else if(commands.indexOf(data.command) !== -1) {
        Object.keys(this.virtualSpheros).forEach(virtualSpheroName => {
          var direction = data.arguments[1] - 90;
          var y2 = Math.sin(direction * Math.PI / 180) * 0.1;
          var x2 = Math.cos(direction * Math.PI / 180) * 0.1;
          console.log(x2, y2);
          Matter.Body.applyForce(this.virtualSpheros[virtualSpheroName], { x: 0, y: 0}, { x: x2, y: y2 });
        });
      }
    }.bind(this);

    this.engine = Engine.create();
    this.render = Render.create({
      element: document.getElementById("canvas-container"),
      engine: this.engine
    });
>>>>>>> 改行コードを修正

    var ground1 = Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
    var ground2 = Bodies.rectangle(10, 300, 20, 600, { isStatic: true });
    var ground3 = Bodies.rectangle(400, 10, 800, 20, { isStatic: true });
    var ground4 = Bodies.rectangle(790, 300, 20, 600, { isStatic: true });

<<<<<<< 400798a4460180512b86a4458b95e7fa925c1c16
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
=======
    this.engine.world.gravity.y = 0;

    World.add(this.engine.world, [ground1, ground2, ground3, ground4]);

    Engine.run(this.engine);
    Render.run(this.render);

    this.virtualSpheros = {};
  }

  VirtualSpheroController.prototype.addVirtualSphero = function(spheroName) {
    this.virtualSpheros[spheroName] = Bodies.circle(400, 400, 30, {
      friction: 0.1
    });
    World.add(this.engine.world, [this.virtualSpheros[spheroName]]);
>>>>>>> 改行コードを修正
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
<<<<<<< 400798a4460180512b86a4458b95e7fa925c1c16
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

=======
});
>>>>>>> 改行コードを修正
