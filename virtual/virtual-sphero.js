function VirtualSphero(canvas, speedController) {
  this.speedController = speedController;
  this.canvas = canvas;

  this.x = 0;
  this.y = 0;
  this.ex = 0;
  this.ey = 0;
  this.radius = 25;

  this.width = this.canvas.width;
  this.height = this.canvas.height;

  this.ctx = this.canvas.getContext("2d");
  this.ctx.fillStyle = "white";

  this.logo = new Image();
  this.logo.src = "logo.png";
  this.isLoadedLogo = false;
  this.logo.onload = () => {
    this.isLoadedLogo = true;
  };
}

VirtualSphero.prototype.roll = function(far, degree) {
  var radian = (degree * Math.PI / 180);

  this.ex = Math.sin(radian) * far * this.speedController.speed;
  this.ey = -Math.cos(radian) * far * this.speedController.speed;
};

VirtualSphero.prototype.color = function(color) {
  this.ctx.fillStyle = color;
};

VirtualSphero.prototype.move = function() {
  this.x += this.ex;
  this.y += this.ey;
  this.fixPosition();
};

VirtualSphero.prototype.draw = function() {
  if (!this.isLoadedLogo) {
    return;
  }

  this.ctx.beginPath();
  this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2, true);
  this.ctx.fill();
  this.ctx.stroke();

  this.ctx.drawImage(this.logo, this.x + 8, this.y + 8, 30, 30);
};

VirtualSphero.prototype.fixPosition = function () {
  this.x = Math.max(this.x, 0);
  this.y = Math.max(this.y, 0);

  this.x = Math.min(this.x, this.canvas.width - 50);
  this.y = Math.min(this.y, this.canvas.height - 50);
};
