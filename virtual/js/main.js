import virtualSpheroManeger from "./virtual-sphero-maneger";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", function() {
  const sphero = new virtualSpheroManeger();

  window.addEventListener("resize", function() {
    sphero.resizeWindow();
  });
});
