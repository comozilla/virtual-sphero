function VirtualSphero(canvas, speedController, spheroName) {
  this.speedController = speedController;
  this.canvas = canvas;
  this.spheroName = spheroName;

  this.ex = 0;
  this.ey = 0;
  this.radius = 25;
  this.direction = 0;

  this.body = Matter.Bodies.circle(1, 1, this.radius, {
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
  this.rotate(degree);
  var direction = (degree + 270) % 360;
  this.ex = Math.cos(direction * Math.PI / 180) * far * 0.1;
  this.ey = Math.sin(direction * Math.PI / 180) * far * 0.1;
};

VirtualSphero.prototype.rotate = function(degree) {
  this.direction = degree;
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

  var rad = this.direction * Math.PI / 180;
  this.ctx.save();
  this.ctx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), this.body.position.x, this.body.position.y);
  this.ctx.translate(-1 * this.radius + 10, -1 * this.radius + 10);
  this.ctx.drawImage(this.logo, 0, 0, 30, 30);
  this.ctx.restore();
};

VirtualSphero.prototype.fixPosition = function () {
  this.x = Math.max(this.x, 0);
  this.y = Math.max(this.y, 0);

  this.x = Math.min(this.x, this.canvas.width - 50);
  this.y = Math.min(this.y, this.canvas.height - 50);
};

VirtualSphero.prototype.setPosition = function(positionX, positionY) {
  Matter.Body.setPosition(this.body, {
    x: positionX,
    y: positionY
  });
};

VirtualSphero.prototype.moveToScreen = function() {
  if (this.body.position.x > this.canvas.width - 50) {
    this.setPosition(this.canvas.width - 50, this.body.position.y);
  }
  if (this.body.position.x < 0) {
    this.setPosition(1, this.body.position.y);
  }
  if (this.body.position.y > this.canvas.height - 50) {
    this.setPosition(this.body.position.x, this.canvas.height - 50);
  }
  if (this.body.position.y < 0) {
    this.setPosition(this.body.position.x, 1);
  }
};
