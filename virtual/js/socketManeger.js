import eventPublisher from "./publisher";

export default class SocketManeger {
  constractor() {
    this.socket = io();

    this.socket.on("connect", () => {
      eventPublisher.publish("isNeedShowSpheros", true);
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

    eventPublisher.subscribe("sendShowSpheros", showSpheros => {
      this.socket.emit("request", {
        showSpheros: showSpheros
      });
    });
  }

  addVirtualSphero(spheroName) {
    eventPublisher.publish("addVirtualSphero", spheroName);
  }

  removeVirtualSphero(spheroName) {
    eventPublisher.publish("removeVirtualSphero", spheroName);
  }
}
