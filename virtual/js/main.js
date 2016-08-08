import VirtualSpheroController from "./virtual-sphero-controller";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", function() {
  const sphero = new VirtualSpheroController();

  window.addEventListener("resize", function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    sphero.clearCanvas();
    sphero.resetGrounds();
    sphero.fixSpherosPosition();
  });
});
