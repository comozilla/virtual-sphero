var VirtualSphero = (function() {
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
  function VirtualSphero() {
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
      if (commands.indexOf(data.command) !== -1) {
        this[data.command].apply(this, data.arguments);
      }
    }.bind(this);

    this.speedController = new SpeedController();
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.ex = 0;
    this.ey = 0;

    this.radius = 25;

    var tick = () => {
      this.x += this.ex;
      this.y += this.ey;
      this.fixPosition();
      this.updateSpheroPosition();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  VirtualSphero.prototype.roll = function(far, degree) {
    var radian = (degree * Math.PI / 180);

    this.ex = Math.sin(radian) * far * this.speedController.speed;
    this.ey = -Math.cos(radian) * far * this.speedController.speed;
  };

  VirtualSphero.prototype.updateSpheroPosition = function() {
    this.clearCanvas();
    this.ctx.beginPath();
    this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2, true);
    this.ctx.stroke();

    var logo = new Image();
    logo.src = "logo.png";

    this.ctx.drawImage(logo, this.x + 8, this.y + 8, 30, 30);
  };

  VirtualSphero.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  VirtualSphero.prototype.fixPosition = function () {
    this.x = Math.max(this.x, 0);
    this.y = Math.max(this.y, 0);

    this.x = Math.min(this.x, this.canvas.width - 50);
    this.y = Math.min(this.y, this.canvas.height - 50);
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
  return VirtualSphero;
})();

document.addEventListener("DOMContentLoaded", function() {
  var sphero = new VirtualSphero();
});

