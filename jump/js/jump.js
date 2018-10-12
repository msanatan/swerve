'use strict';
kontra.init();

let player = kontra.sprite({
  x: 5,
  y: kontra.canvas.height - 60,
  color: 'red',
  width: 30,
  height: 18,
  gravity: 0.75,
  grounded: false,
  jumping: false,
  lastY: 0,
});


let collideGround = () => {
  if (player.y >= kontra.canvas.height - player.height) {
      player.y = kontra.canvas.height - player.height;
      player.grounded = true;
      player.jumping = false;
      player.dy = 0;
  }
}

let loop = kontra.gameLoop({
  update: () => {
    player.update();
    collideGround();

    // Determine when to stop jumping if not colliding with anything
    if (player.lastY - player.y >= 60) {
      player.jumping = false;
    }

    // Pull player down if not jumping and in the air
    if (!player.grounded && !player.jumping) {
      player.dy += 0.05;
    }

    // Pick up player movement
    if (kontra.keys.pressed('space') && player.grounded) {
      player.dy = -player.gravity - 0.5;
      player.grounded = false;
      player.jumping = true;
      player.lastY = player.y;
    } else if (kontra.keys.pressed('right')) {
      player.x += 1;
    } else if (kontra.keys.pressed('left')) {
      player.x -= 1;
    }
  },

  render: () => {
    player.render();
  }
});

loop.start();
