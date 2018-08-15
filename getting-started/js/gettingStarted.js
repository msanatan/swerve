kontra.init();

let sprite = kontra.sprite({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2 - 15,
  color: 'red',
  width: 15,
  height: 30,
  dx: 2
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
