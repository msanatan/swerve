'use strict';
kontra.init();

let player = kontra.sprite({
  x: 5,
  y: kontra.canvas.height - 10,
  color: 'red',
  width: 10,
  height: 6,
});

let loop = kontra.gameLoop({
  update: () => {
    player.update();
  },

  render: () => {
    player.render();
  }
});

loop.start();
