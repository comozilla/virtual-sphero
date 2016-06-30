function VirtualSphero(canvas) {
  this.ex = 0;
  this.ey = 0;
  this.ctx = canvas.getContext("2d");

  this.logo = new Image();
  this.logo.src = "logo.png";
  this.isLoadedLogo = false;
  this.logo.onload = () => {
    this.isLoadedLogo = true;
  }
};
VirtualSphero.prototype.roll = function(far, degree) {
  var radian = (degree * Math.PI / 180);

  this.ex = Math.sin(radian) * far * this.speedController.speed;
  this.ey = -Math.cos(radian) * far * this.speedController.speed;
};
VirtualSphero.prototype.color = function(color) {
  this.ctx.fillStyle = color;
};
VirtualSphero.prototype.draw = function() {
  if (!this.isLoadedLogo) {
    return;
  }

  this.clearCanvas();
  this.ctx.beginPath();
  this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2, true);
  this.ctx.fill();
  this.ctx.stroke();
  
  this.ctx.drawImage(logo, this.x + 8, this.y + 8, 30, 30);
};