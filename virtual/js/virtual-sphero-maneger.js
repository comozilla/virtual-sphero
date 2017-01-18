import virtualSphero from "./virtual-sphero";
import canvasManeger from "./canvasManeger";
import socketManeger from "./socketManeger";
import eventPublisher from "./publisher";
import { Engine, Render, World, Body, Bodies } from "matter-js";

export default class virtualSpheroManeger {
  constructor() {
    const showParam = getParams().show;
    this.showSpheros = typeof showParam === "undefined" ? null : showParam.split(",");

    eventPublisher.subscribe("isNeedShowSpheros", isNeed => {
      if (isNeed) {
        eventPublisher.publish("sendShowSpheros", showSpheros);
      }
    });

    eventPublisher.subscribe("addVirtualSphero", spheroName => {
      this.addVirtualSphero(spheroName);
    });

    eventPublisher.subscribe("removeVirtualSphero", spheroName => {
      this.removeVirtualSphero(spheroName);
    });

    this.engine = Engine.create();
    this.engine.world.gravity.y = 0;
    Engine.run(this.engine);

    this.socketManeger = new socketManeger();

    this.canvas = document.getElementById("canvas");
    this.canvasManeger = new canvasManeger(this.canvas);

    const tick = () => {
      this.canvasManeger.clearCanvas();
      Object.keys(this.virtualSpheros).forEach(spheroName => {
        this.virtualSpheros[spheroName].move();
        this.virtualSpheros[spheroName].draw();
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    this.virtualSpheros = {};
  }

  addVirtualSphero(spheroName) {
    this.virtualSpheros[spheroName] = new virtualSphero(this.canvas, spheroName);
    World.add(this.engine.world, this.virtualSpheros[spheroName].body);
  }

  removeVirtualSphero(spheroName) {
    World.remove(this.engine.world, this.virtualSpheros[spheroName].body);
    delete this.virtualSpheros[spheroName];
  }

  resizeWindow() {
    this.canvasManeger.resizeCanvas();
    this.canvasManeger.clearCanvas();
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
