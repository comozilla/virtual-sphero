import eventPublisher from "./publisher";

export default class SocketManager {
  constructor() {
    this.socket = io();

    this.socket.on("connect", () => {
      eventPublisher.publish("isNeedShowSpheros", true);
    });

    this.socket.on("addVirtualSphero", spheroName => {
      eventPublisher.publish("addVirtualSphero", spheroName);
    });

    this.socket.on("removeVirtualSphero", spheroName => {
      eventPublisher.publish("removeVirtualSphero", spheroName);
    });

    this.socket.on("command", (spheroName, commandName, args) => {
      eventPublisher.publish("command", spheroName, commandName, args);
    });

    eventPublisher.subscribe("sendShowSpheros", showSpheros => {
      this.socket.emit("request", {
        showSpheros: showSpheros
      });
    });
  }
}
