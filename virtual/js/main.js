import VirtualSpheroController from "./virtual-sphero-controller";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", function() {
  const sphero = new VirtualSpheroController();

  window.addEventListener("resize", function() {
    sphero.resizeCanvas();
    sphero.clearCanvas();
  });
});
