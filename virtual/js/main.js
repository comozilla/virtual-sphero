import VirtualSpheroManager from "./virtual-sphero-manager";
import CanvasManager from "./canvasManager";
import SocketManager from "./socketManager";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", function() {
  const sphero = new VirtualSpheroManager();
  const socket = new SocketManager();
  const canvas = new CanvasManager();

  window.addEventListener("resize", function() {
    canvas.resizeCanvas();
    canvas.clearCanvas();
  });
});
