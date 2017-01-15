import { Body, Bodies } from "matter-js";

export default class VirtualSphero {
  constructor(canvas, speedController, spheroName) {
    this.speedController = speedController;
    this.canvas = canvas;
    this.spheroName = spheroName;

    this.ex = 0;
    this.ey = 0;
    this.radius = 25;
    this.degree = 0;

    this.body = Bodies.circle(1, 1, this.radius, {
      friction: 0.1
    });

    this.ctx = this.canvas.getContext("2d");
    this.fillColor = "white";

    this.logo = new Image();
    this.logo.src = "logo.png";
    this.isLoadedLogo = false;
    this.logo.onload = () => {
      this.isLoadedLogo = true;
    };
  }

  roll(speed, degree) {
    this.rotate(degree);
    const rollDegree = (this.degree + 270) % 360;
    this.ex = Math.cos(rollDegree * Math.PI / 180) * speed * 0.1;
    this.ey = Math.sin(rollDegree * Math.PI / 180) * speed * 0.1;
  }

  rotate(degree) {
    this.degree = degree;
  }

  color(color) {
    this.fillColor = color;
  }

  randomColor() {
    this.fillColor = "#" + Math.floor(Math.random() * 16777216).toString(16);
  }

  move() {
    this.setPosition(this.body.position.x + this.ex, this.body.position.y + this.ey);
    this.fixPosition();
  }

  draw() {
    if (!this.isLoadedLogo) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = this.fillColor;
    this.ctx.arc(this.body.position.x, this.body.position.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.stroke();

    const rad = this.degree * Math.PI / 180;
    this.ctx.save();
    this.ctx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), this.body.position.x, this.body.position.y);
    this.ctx.translate(-this.radius + 10, -this.radius + 10);
    this.ctx.drawImage(this.logo, 0, 0, 30, 30);
    this.ctx.restore();
  }

  fixPosition() {
    this.setPosition(this.getValueInRange(this.canvas.width - this.radius, this.radius, this.body.position.x),
      this.getValueInRange(this.canvas.height - this.radius, this.radius, this.body.position.y));
  }

  setPosition(x, y) {
    Body.setPosition(this.body, { x, y });
  }

  getValueInRange(max, min, num) {
    return Math.max(min, Math.min(num, max));
  }
}
