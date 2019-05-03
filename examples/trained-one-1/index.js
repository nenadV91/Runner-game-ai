let ui;
let canvas;
let width;
let height;
let population;
let ground;
let bottom;
let stats;
let speed = 5;
let obstacles = [];
let obstacleRate = 75;
let nextDist = 100;
let time = 0;
const total = 1;

setInterval(() => {
  time += 1
}, 1000)

const colors = {
  bg: 'rgb(247, 247, 247)'
}

function setup() {
  width = 750;
  height = 300;
  canvas = createCanvas(width, height);
  canvas.parent('canvas')

  bottom = height - 20;
  population = new Population(Player, total);
  ground = new Ground(width, bottom);
  stats = new Stats(25, 25);
  ui = new UI();

  obstacles.push(new Obstacle());
  const [player] = population.active;
  player.loadData(trained_data);
}

function draw() {
  clear();
  background(colors.bg);

  stats.show();
  ground.show();
  population.update();

  if(population.isEmpty) {
    population.reset();
    stats.setHS();
    obstacles = [];
    frameCount = 0;
    speed = 5;
  }

  if(frameCount % 100 === 0) {
    speed += 0.15;
  }

  if(!nextDist--) {
    nextDist = int(random(45, 100))
    const number = random();

    if(number < 0.6 && number > 0.4) {
      obstacles.push(...Obstacle.double())
    } else if(number <= 0.4 && number > 0.2) {
      obstacles.push(...Obstacle.triple())
    } else if(number <= 0.2) {
      obstacles.push(new Bird())
    } else {
      obstacles.push(new Obstacle())
    }
  }


  for(let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].show();
    obstacles[i].update();

    for(let j = population.active.length - 1; j >= 0; j--) {
      if(!population.imortal && obstacles[i].hit(population.active[j])) {
        population.remove(j)
      }
    }

    if(obstacles[i].x <= -obstacles[i].width) {
      obstacles.splice(i, 1);
    }
  }

  for(let i = population.active.length - 1; i >= 0; i--) {
    population.active[i].update();
    population.active[i].think(obstacles);
    population.active[i].show();
  }
}