class Cloud {
  constructor(w, y, h = 40) {
    this.width = w;
    this.height = w * 0.3;
    this.x = width;
    this.y = y;
    this.speed = random([1, 1.5, 2]);
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    tint(255, 150)
    image(images.cloud, this.x, this.y, this.width, this.height);
  }
}