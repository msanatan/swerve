kontra.init();

let sprite = kontra.sprite({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2 - 40,
  color: 'red',
  width: 30,
  height: 80,
  dx: 3
});

let loop = kontra.gameLoop({
  update: () => {
    sprite.update();
    if (sprite.x > kontra.canvas.width) {
      sprite.x = -sprite.width;
    }
  },

  render: () => {
    sprite.render();
  }
});

loop.start();
