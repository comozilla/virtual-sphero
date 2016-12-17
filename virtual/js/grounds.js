import { Engine, Render, World, Body, Bodies } from "matter-js";

export default class Grounds {
  constructor(width, height, engine) {
    this.engine = engine;
    this.walls = {};
    this.setSize(width, height);
  }

  refreshWalls() {
    ["top", "right", "bottom", "left"].forEach(wallType => {
      refreshWall.call(this, wallType);
    });
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.refreshWalls();
  }
}

function getRect(groundType) {
  const thickness = 100;
  const positions = {
    top: { x: this.width / 2, y: -(thickness / 2), width: this.width, height: thickness },
    right: { x: this.width + thickness / 2, y: this.height / 2, width: thickness, height: this.height },
    bottom: { x: this.width / 2, y: this.height + thickness / 2, width: this.width, height: thickness },
    left: { x: -(thickness / 2), y: this.height / 2, width: thickness, height: this.height }
  };
  if (typeof positions[groundType] === "undefined") {
    throw new Error("groundTypeが正しくありません。");
  }
  return positions[groundType];
}

function refreshWall(wallType) {
  const rect = getRect.call(this, wallType);
  const wallName = `ground${wallType.charAt(0).toUpperCase()}${wallType.slice(1)}`;
  if (typeof this.walls[wallType] === "undefined") {
    const wall = Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: true });
    wall.restitution = 0;
    World.add(this.engine.world, wall);
    this.walls[wallType] = {
      body: wall,
      width: rect.width,
      height: rect.height
    };
  } else {
    const wall = this.walls[wallType];
    Body.setPosition(wall.body, { x: rect.x, y: rect.y });
    Body.scale(wall.body, rect.width / wall.width, rect.height / wall.height);
    wall.width = rect.width;
    wall.height = rect.height;
  }
}
