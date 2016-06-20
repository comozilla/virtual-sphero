var VirtualSphero = (function() {
  function VirtualSphero() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.ex = 0;
    this.ey = 0;

    this.radius = 25;

    var tick = () => {
      this.x += this.ex;
      this.y += this.ey;
      this.fixPosition();
      this.updateSpheroPosition();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  VirtualSphero.prototype.roll = function(far, degree) {
    var speed = 0.2;

    var radian = (degree * Math.PI / 180);

    this.ex = Math.sin(radian) * far * speed;
    this.ey = -Math.cos(radian) * far * speed;
  };

  VirtualSphero.prototype.updateSpheroPosition = function() {
    this.clearCanvas();
    this.ctx.beginPath();
    this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2, true);
    this.ctx.stroke();

    var logo = new Image();
    logo.src = "logo.png";

    this.ctx.drawImage(logo, this.x + 8, this.y + 8, 30, 30);
  };

  VirtualSphero.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  VirtualSphero.prototype.fixPosition = function () {
    this.x = Math.max(this.x, 0);
    this.y = Math.max(this.y, 0);

    this.x = Math.min(this.x, this.canvas.width - 50);
    this.y = Math.min(this.y, this.canvas.height - 50);
  };
  return VirtualSphero;
})();

document.addEventListener("DOMContentLoaded", function() {
  var sphero = new VirtualSphero();

  var plugin = new PluginClient("virtual");
  plugin.on("command", function(command, args) {
    if (command === "roll") {
      sphero.roll.apply(sphero, args);
    }
  });
});
