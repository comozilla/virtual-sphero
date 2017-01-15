import { Body, Bodies } from "matter-js";

export default class VirtualSphero {
  constructor(spheroName, width, height) {
    this.spheroName = spheroName;

    this.ex = 0;
    this.ey = 0;
    this.radius = 25;
    this.direction = 0;

    this.body = Bodies.circle(1, 1, this.radius, {
      friction: 0.1
    });
    this.body.restitution = 0;

    this.width = width;
    this.height = height;

    this.fillColor = "white";

    this.logo = new Image();
    this.logo.src = "logo.png";
    this.isLoadedLogo = false;
    this.logo.onload = () => {
      this.isLoadedLogo = true;
    };
  }

  // sphero.js methods
  roll(far, degree) {
    this.rotate(degree);
    const direction = (degree + 270) % 360;
    this.ex = Math.cos(direction * Math.PI / 180) * far * 0.1;
    this.ey = Math.sin(direction * Math.PI / 180) * far * 0.1;
  }

  rotate(degree) {
    this.direction = degree;
  }

  color(color) {
    this.fillColor = color;
  }

  randomColor() {
    this.fillColor = "#" + Math.floor(Math.random() * 16777216).toString(16);
  }

  // virtual-sphero methods
  tick() {
    Body.setPosition(this.body, {
      x: this.body.position.x + this.ex,
      y: this.body.position.y + this.ey
    });
    this.fixPosition();
  }

  draw(ctx) {
    if (!this.isLoadedLogo) {
      return;
    }

    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.arc(this.body.position.x, this.body.position.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();

    const rad = this.direction * Math.PI / 180;
    ctx.save();
    ctx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), this.body.position.x, this.body.position.y);
    ctx.translate(-this.radius + 10, -this.radius + 10);
    ctx.drawImage(this.logo, 0, 0, 30, 30);
    ctx.restore();
  }

  fixPosition() {
    this.setPosition(this.getValueInRange(this.width - this.radius, this.radius, this.body.position.x),
      this.getValueInRange(this.height - this.radius, this.radius, this.body.position.y));
  }

  setPosition(x, y) {
    Body.setPosition(this.body, { x, y });
  }

  getValueInRange(max, min, num) {
    return Math.max(min, Math.min(num, max));
  }
}
