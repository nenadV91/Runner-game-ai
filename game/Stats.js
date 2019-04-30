class Stats {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.key = 't-rex-runner-hs'
    this.hs = this.getHS() || '000000';

    this.colors = {
      light: color(0, 0, 0, 100),
      normal: color(0, 0, 0)
    }
  }

  getHS() {
    return localStorage.getItem(this.key)
  }

  setHS() {
    if(!this.hs || score > this.hs) {
      localStorage.setItem(this.key, score);
    }
  }

  show() {
    noStroke()
    const space = 14

    // Left
    textSize(10);
    fill(this.colors.light)
    text(`Best: ${int(this.hs)}`, this.x, this.y);
    fill(this.colors.normal);
    text(`Speed: ${speed.toFixed(2)}`, this.x, this.y + space);
    text(`Score: ${int(score)}`, this.x, this.y + space * 2);

    // Right
    text(`Time: ${toTime(time)}`, width - 100, this.y);
    text(`Alive units: ${population.active.length}`, width - 100, this.y + space);
    text(`Generation: ${population.generation}`, width - 100, this.y + space * 2);
  }
}