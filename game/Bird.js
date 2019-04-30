class Bird extends Obstacle {
  constructor(...props) {
    super(...props);
    this.height = 20;
    this.width = 40;
    this.type = 'bird';

    this.level = floor(random(1, 5));
    this.y = bottom - 15 * this.level - 5;

    const min = speed - 1;
    const max = speed + 3;
    this.speed = floor(random(min, max))
  }
}