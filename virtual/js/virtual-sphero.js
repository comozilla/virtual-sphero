import { Body, Bodies } from "matter-js";

export default class VirtualSphero {
  constructor(canvas, speedController, spheroName) {
    this.speedController = speedController;
    this.canvas = canvas;
    this.spheroName = spheroName;

    this.ex = 0;
    this.ey = 0;
    this.radius = 25;
    this.direction = 0;

    this.body = Bodies.circle(1, 1, this.radius, {
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

  move() {
    Body.setPosition(this.body, {
      x: this.body.position.x + this.ex,
      y: this.body.position.y + this.ey
    });
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

    const rad = this.direction * Math.PI / 180;
    this.ctx.save();
    this.ctx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), this.body.position.x, this.body.position.y);
    this.ctx.translate(-this.radius + 10, -this.radius + 10);
    this.ctx.drawImage(this.logo, 0, 0, 30, 30);
    this.ctx.restore();
  }

  fixPosition() {
    const x = Math.max(this.body.position.x, 0 + this.radius);
    const y = Math.max(this.body.position.y, 0 + this.radius);
    this.setPosition(Math.floor(Math.min(x, this.canvas.width - this.radius)), Math.floor(Math.min(y, this.canvas.height - this.radius)));
  }

  setPosition(x, y) {
    Body.setPosition(this.body, { x, y });
  }
}
