import virtualSpheroManager from "./virtual-sphero-manager";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", function() {
  const sphero = new virtualSpheroManager();

  window.addEventListener("resize", function() {
    sphero.resizeWindow();
  });
});
