class Obstacle {
  constructor(obstacle) {
    this.x = width;
    this.height = random(20, 50);
    this.y = bottom - this.height;
    this.width = this.height * 0.5;
    this.type = 'tree';

    this.speed = speed;
    this.color = color(0, 0, 0);
  }

  update() {
    this.x -= this.speed;
  }

  hit(player) {
    const { x: px, y: py, width: pw, height: ph } = player;
    const { x: ox, y: oy, width: ow, height: oh } = this;

    const hit = collideRectRect(px, py, pw, ph, ox, oy, ow, oh);

    if(hit) {
      // this.color = color(255, 0, 0);
      return true;
    }
  }

  clone(obstacle, scale, n = 1) {
    const clone = new Obstacle();
    clone.height = obstacle.height * scale;
    clone.width = obstacle.width * scale;
    clone.y = bottom - clone.height;
    clone.x = width + (obstacle.width + 10) * n;
    return clone;
  }
  static double() {
    const obstacle = new Obstacle();
    const clone = obstacle.clone(obstacle, random(0.6, 1));
    return [obstacle, clone];
  }

  static triple() {
    const obstacle = new Obstacle();
    const cloneA = obstacle.clone(obstacle, random(0.6, 1));
    const cloneB = obstacle.clone(cloneA, random(0.4, 0.7), 2);
    return [obstacle, cloneA, cloneB];
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }
}