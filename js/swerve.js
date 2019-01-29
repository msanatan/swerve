'use strict';
// Set dimensions of canvas
document.getElementById('game').width = window.innerWidth;
document.getElementById('game').height = window.innerHeight;
// Set resolution of canvas
document.getElementById('game').style.width = window.innerWidth + 'px';
document.getElementById('game').style.height = window.innerHeight + 'px';

// Definie resolution game is defined for
// Scaling idea taken from:
// https://stackoverflow.com/questions/33515707/scaling-a-javascript-canvas-game-properly
const nativeWidth = 800;
const nativeHeight = 640;
const scaleRatio = Math.min(window.innerWidth / nativeWidth, window.innerHeight / nativeHeight);;
const baseSpriteRadius = 30;
const scaledSpriteRadius = baseSpriteRadius * scaleRatio;

// Defining text sizes, with scaling we can't use absolute positiong and sizes
const scoreTextOffset = {
  x: 120 * scaleRatio,
  y: 40 * scaleRatio
};

const textFontSizes = {
  small: 30 * scaleRatio,
  large: 80 * scaleRatio,
  title: 120 * scaleRatio
}

const gameOverTextOffset = {
  highscore: 60 * scaleRatio,
  instructions: 100 * scaleRatio
};

// Define globals
let maxEnemies = 15;
// As we add enemies every second up till the max, we use this variable to help
// track when a second is passed
let frameCount = 0;
let gameOver = false;
kontra.init();

// Remove image smoothening
kontra.context.imageSmoothingEnabled = false

// Set high score at the beginning:
kontra.store.set('highScore', 0);

// Define player
let player = kontra.sprite({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2,
  color: 'yellow',
  radius: scaledSpriteRadius,
  score: 0,
  pointerDown: false,
  onDown() {
    this.pointerDown = true;
  },
  onUp() {
    this.pointerDown = false;
  },
  collidesWithPointer(pointer) {
    // perform a circle v circle collision test
    let dx = pointer.x - this.x;
    let dy = pointer.y - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius * 2;
  },
  update(enemies) {
    // Update position to track pointer movements
    if (this.pointerDown) {
      this.x = kontra.pointer.x;
      this.y = kontra.pointer.y;
    }
    // End the game if we hit an enemy
    enemies.forEach(enemy => {
      if (this.collidesWithPointer(enemy)) {
        gameOver = true;
        // Check to see if score is highest
        let previousHighScore = kontra.store.get('highScore')
        if (this.score > previousHighScore) {
          kontra.store.set('highScore', this.score);
        }
      }
    })
  },
});

// render player like a ball
player.render = () => {
  kontra.context.fillStyle = player.color;
  kontra.context.beginPath();
  kontra.context.arc(player.x, player.y, player.radius, 0, 2 * Math.PI, false);
  kontra.context.fill();
}
// Track player with pointer
kontra.pointer.track(player);

// Add container for enemies
let enemies = [];

// Create a function that can add an enemy
const createEnemy = () => {
  let startingX = Math.floor(Math.random() * kontra.canvas.width);
  let startingY = -10;
  let enemy = kontra.sprite({
    x: startingX,
    y: startingY,
    radius: scaledSpriteRadius,
    // Movement should be scaled as well
    dx: Math.floor(Math.floor(Math.random() * 4) - 2 * scaleRatio),
    dy: Math.floor(Math.floor(Math.random() * 7) + 4 * scaleRatio),
    color: 'red',

    update() {
      this.x += this.dx;
      this.y += this.dy;

      // If the enemy left the screen then set 'time to live' to 0
      if (this.y >= kontra.canvas.height ||
          this.x <= -this.radius ||
          this.x >= kontra.canvas.width + this.radius) {
        this.ttl = 0
      }
    },

    render() {
      kontra.context.fillStyle = this.color;
      kontra.context.beginPath();
      kontra.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      kontra.context.fill();
    }
  });
  enemies.push(enemy);
}

// Reset game state for when game is over
const reset = () => {
  // Reset enemy state
  enemies = [];
  maxEnemies = 30;
  frameCount = 0
  // Reset player state
  player.score = 0;
  player.frameCount = 0;
  player.x = kontra.canvas.width / 2;
  player.y = kontra.canvas.height / 2;
  player.pointerDown = false;
  // Reset globale game state
  gameOver = false;
}

const checkReset = () => {
  if (gameOver) {
    reset();
  }
}

// Set touch and mouse up event listeners for game over case
// They come before the game loop as the checkReset function needs to be defined
kontra.canvas.addEventListener("mousedown", checkReset, false);
kontra.canvas.addEventListener("touchstart", checkReset, false);

// Main game loop
const gameLoop = kontra.gameLoop({
  update: () => {
    // Check if game is over and skip logic
    if (gameOver) {
      return
    }

    // We update by one every update as kontra guarantees 60 FPS.
    // So after 60 we get a second
    player.update(enemies);
    enemies.forEach(enemy => enemy.update());
    // Remove dead enemies
    enemies = enemies.filter(enemy => enemy.isAlive());

    // Every 1/4 of a second, check if we've reached the limits of enemies and add if
    // we still can
    if (frameCount % 15 == 0) {
      if (enemies.length < maxEnemies) {
        createEnemy();
      }
    }

    // Every second add to the player's score
    if (frameCount % 60 == 0) {
      player.score += 1;
    }

    // To ramp up difficulty, every minute increase the max number of enemies
    if (player.score % 60 == 0) {
      maxEnemies += 2;
    }

    // Increment every frame
    frameCount += 1;
  },

  render: () => {
    player.render();
    enemies.forEach(enemy => enemy.render());

    // Render score
    kontra.context.font = `${textFontSizes.small}px Helvetica, Verdana, san-serif`;
    kontra.context.fillStyle = 'white';
    let score = `Score: ${player.score}`
    kontra.context.fillText(score, kontra.canvas.width - scoreTextOffset.x, scoreTextOffset.y);

    // If the game is over, ensure this text is displayed at the top of the screen
    if (gameOver) {
      kontra.context.font = `${textFontSizes.large}px Helvetica, Verdana, san-serif`;
      kontra.context.textBaseline = 'middle';
      kontra.context.textAlign = 'center';
      kontra.context.fillText('Game Over', kontra.canvas.width / 2, kontra.canvas.height / 2);
      kontra.context.font = `${textFontSizes.small}px Helvetica, Verdana, san-serif`;
      let highScore = `Highest Score: ${kontra.store.get('highScore')}`;
      kontra.context.fillText(highScore, kontra.canvas.width / 2, (kontra.canvas.height / 2) + gameOverTextOffset.highscore);
      kontra.context.fillText('Press to try again', kontra.canvas.width / 2, (kontra.canvas.height / 2) + gameOverTextOffset.instructions);
    }
  }
});

// Create a sprite to manage button clicks to start game
let playButton = kontra.sprite({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2 + (100 * scaleRatio),
  color: 'red',
  radius: 100 * scaleRatio,
  textFontSize: 80 * scaleRatio,
  pointerUp: false,
  onUp() {
    this.pointerUp = true;
  },
  update() {
    // Update position to track pointer movements
    if (this.pointerUp) {
      menuLoop.stop();
      gameLoop.start();
      return
    }
  },
});

// render player like a ball
playButton.render = () => {
  kontra.context.fillStyle = playButton.color;
  kontra.context.beginPath();
  kontra.context.arc(playButton.x, playButton.y, playButton.radius, 0, 2 * Math.PI, false);
  kontra.context.fill();

  kontra.context.fillStyle = 'white';
  kontra.context.font = `${playButton.textFontSize}px Verdana, Geneva, sans-serif`;
  kontra.context.textBaseline = 'middle';
  kontra.context.textAlign = 'center';
  kontra.context.fillText('Play', playButton.x, playButton.y);

}

// Track player with pointer
kontra.pointer.track(playButton);

const menuLoop = kontra.gameLoop({
  update: () => {
    playButton.update();
  },
  render: () => {
    kontra.context.fillStyle = 'white';
    kontra.context.font = `${textFontSizes.title}px "Comic Sans MS", cursive, sans-serif`;
    kontra.context.textBaseline = 'middle';
    kontra.context.textAlign = 'center';
    kontra.context.fillText('Swerve', kontra.canvas.width / 2, 150 * scaleRatio);

    playButton.render();
  }
});

// gameLoop.start();
menuLoop.start();
