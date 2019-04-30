class Ground {
  constructor(w, y, h = 1) {
    this.width = w;
    this.height = h;
    this.y = y;

    this.color = color(51);
  }

  show() {
    noStroke();
    fill(this.color);
    rect(0, this.y, this.width, this.height);
  }
}