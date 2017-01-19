import VirtualSpheroManager from "./virtual-sphero-manager";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", function() {
  const sphero = new VirtualSpheroManager();

  window.addEventListener("resize", function() {
    sphero.resizeWindow();
  });
});
