import VirtualSphero from "./virtual-sphero";
import SpeedController from "./speed-controller";
import { Engine, Render, World, Body, Bodies } from "matter-js";

export default class VirtualSpheroController {
  constructor() {
    const showParam = getParams().show;
    this.showSpheros = typeof showParam === "undefined" ? null : showParam.split(",");
    this.socket = io();

    this.socket.on("connect", () => {
      this.socket.emit("request", {
        showSpheros: this.showSpheros
      });
    });

    this.socket.on("addVirtualSphero", spheroName => {
      this.addVirtualSphero(spheroName);
    });

    this.socket.on("removeVirtualSphero", spheroName => {
      this.removeVirtualSphero(spheroName);
    });

    this.socket.on("command", (spheroName, commandName, args) => {
      const virtualSphero = this.virtualSpheros[spheroName];
      if (typeof virtualSphero !== "undefined" &&
          typeof virtualSphero[commandName] !== "undefined") {
        virtualSphero[commandName].apply(virtualSphero, args);
      }
    });

    this.engine = Engine.create();
    this.engine.world.gravity.y = 0;
    Engine.run(this.engine);

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const tick = () => {
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

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addVirtualSphero(spheroName) {
    this.virtualSpheros[spheroName] = new VirtualSphero(this.canvas, spheroName);
    World.add(this.engine.world, this.virtualSpheros[spheroName].body);
  }

  removeVirtualSphero(spheroName) {
    World.remove(this.engine.world, this.virtualSpheros[spheroName].body);
    delete this.virtualSpheros[spheroName];
  }
}

const commands = [

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

function getParams() {
  const paramsObject = {};
  location.search.substring(1).split("&").forEach(keyValuePair => {
    const keyAndValue = keyValuePair.split("=");
    paramsObject[keyAndValue[0]] = keyAndValue[1];
  });
  return paramsObject;
}
