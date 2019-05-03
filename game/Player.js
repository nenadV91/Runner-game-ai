class Player {
  constructor(opts = {}) {
    this.opts = opts;
    this.x = opts.x || 50;
    this.width = opts.width || 15;
    this.height = opts.height || 40;
    this.baseHeight = this.height;
    this.y = bottom - this.height;

    this.jumpSize = 0;
    this.isDucking = false;
    this.isJumping = false;
    this.isStanding = true;

    this.color = color(0, 0, 0, 100);
    this.fill = color(51, 51, 51, 10);

    this.score = 1;
    this.fitness = 0;

    if(opts.brain instanceof NeuralNetwork) {
      this.brain = opts.brain.clone();
      this.brain.mutate(0.1)
    } else {
      this.brain = new NeuralNetwork();
      this.brain.add(new Layer({ inodes: 15, onodes: 10 }));
      this.brain.add(new Layer({ onodes: 10 }));
      this.brain.add(new Layer({ onodes: 4 }));
      this.brain.add(new Layer({ onodes: 2 }));
    }
  }

  think(obstacles) {
    let closest = null;
    let dist = null;
    let count = null;

    for(let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      const newDist = obstacle.x - this.x;

      if(newDist < -50) {
        continue;
      }

      if(!closest || newDist < dist) {
        closest = obstacle;
        dist = newDist;
        count = 1;

        const nextOne = obstacles[i + 1];
        const nextTwo = obstacles[i + 2];
        if(nextOne && abs(closest.x - nextOne.x) < 85) {
          count++;
        }

        if(nextOne && nextTwo && abs(closest.x - nextTwo.x) < 85) {
          count++;
        }
      }
    }

    const input = [];

    if(closest) {
      // Player
      // position
      input[0] = map(this.y, 0, height, 0, 1); // y position

      // state of a player
      input[1] = this.isJumping ? 1 : 0; // is jumping
      input[2] = this.isDucking ? 1 : 0; // is ducking
      input[3] = this.isStanding ? 1 : 0; // is standing

      // Obstacle
      // position
      input[4] = map(closest.x, 0, width, 0, 1); // x position
      input[5] = map(closest.y, 0, height, 0, 1); // y position

      // close obstacle count
      input[6] = count === null ? 1 : 0; // no obstacle
      input[7] = count === 1 ? 1 : 0; // 1 obstacle
      input[8] = count === 2 ? 1 : 0; // 2 obstacle
      input[9] = count === 3 ? 1 : 0; // 3 obstacle

      // obstacle type
      input[10] = closest.type === 'tree' ? 1 : 0; // is tree
      input[11] = closest.type === 'bird' ? 1 : 0; // is bird

      // obstacle speed
      input[12] = map(closest.speed, 1, 50, 0, 1);

      // obstacle size
      input[13] = map(closest.width, 1, 40, 0, 1); // obstacle width
      input[14] = map(closest.height, 20, 50, 0, 1); // obstacle height

      const output = this.brain.predict(input);
      const [jump, duck] = output;

      if(jump > 0.5) {
        this.jump();
      }

      if(duck > 0.5) {
        this.duck();
      }
    }
  }

  update() {
    this.score++;

    if(this.isDucking) {
      this.duck();
    } else {
      this.standUp();
    }

    if(this.isJumping) {
      const jump = Math.pow(this.jumpSize, 2) * 0.035

      if(this.jumpSize <= 0) this.y += jump;
      else this.y -= jump;

      if(this.jumpSize <= -20) {
        this.isJumping = false;
      }

      this.jumpSize -= 1;
    } else {
      this.standUp();
    }
  }


  jump() {
    if(!this.isJumping && !this.isDucking) {
      this.isJumping = true;
      this.isStanding = false;
      this.jumpSize = 20;
    }
  }

  duck() {
    this.height = this.baseHeight / 2;
    this.y = bottom - this.height;
    this.isStanding = false;
    this.isJumping = false;
  }

  standUp() {
    if(!this.isStanding) {
      this.height = this.baseHeight;
      this.y = bottom - this.height;
      this.isStanding = true;
    }
  }

  show() {
    fill(this.fill);
    stroke(this.color);
    rect(this.x, this.y, this.width, this.height);
  }

  getData() {
    return this.brain.layers.reduce((r, e, i) => {
      const layer = {}
      layer.weights = e.weights;
      layer.bias = e.bias;
      r.push(layer)
      return r;
    }, [])
  }

  loadData(data) {
    for(let i = 0; i < this.brain.layers.length; i++) {
      const layer = this.brain.layers[i];
      Object.assign(layer.weights, data[i].weights);
      Object.assign(layer.bias, data[i].bias);
    }
  }
}