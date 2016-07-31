function VirtualSphero(canvas, speedController, spheroName) {
  this.speedController = speedController;
  this.canvas = canvas;
  this.spheroName = spheroName;

  this.ex = 0;
  this.ey = 0;
  this.radius = 25;

  this.body = Matter.Bodies.circle(400, 400, this.radius, {
    friction: 0.1
  });
  this.body.restitution = 0;

  this.width = this.canvas.width;
  this.height = this.canvas.height;

  this.ctx = this.canvas.getContext("2d");
  this.fillColor = "white";

  this.logo = new Image();
  this.logo.src = "logo.png";
  this.isLoadedLogo = false;
  this.logo.onload = () => {
    this.isLoadedLogo = true;
  };
}

VirtualSphero.prototype.roll = function(far, degree) {
  var direction = (degree + 270) % 360;
  this.ex = Math.cos(direction * Math.PI / 180) * far * 0.1;
  this.ey = Math.sin(direction * Math.PI / 180) * far * 0.1;
};

VirtualSphero.prototype.color = function(color) {
  this.fillColor = color;
};

VirtualSphero.prototype.randomColor = function() {
  this.fillColor = "#" + Math.floor(Math.random() * 16777216).toString(16);
};

VirtualSphero.prototype.move = function() {
  Matter.Body.setPosition(this.body, {
    x: this.body.position.x + this.ex,
    y: this.body.position.y + this.ey
  });
  this.fixPosition();
};

VirtualSphero.prototype.draw = function() {
  if (!this.isLoadedLogo) {
    return;
  }

  this.ctx.beginPath();
  this.ctx.fillStyle = this.fillColor;
  this.ctx.arc(this.body.position.x, this.body.position.y, this.radius, 0, Math.PI * 2, true);
  this.ctx.fill();
  this.ctx.stroke();

  this.ctx.drawImage(this.logo, this.body.position.x - 18, this.body.position.y - 18, 30, 30);
};

VirtualSphero.prototype.fixPosition = function () {
  this.x = Math.max(this.x, 0);
  this.y = Math.max(this.y, 0);

  this.x = Math.min(this.x, this.canvas.width - 50);
  this.y = Math.min(this.y, this.canvas.height - 50);
};
