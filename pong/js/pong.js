'use strict';
kontra.init();

let player = kontra.sprite({
  x: kontra.canvas.width - 15 - 10,
  y: kontra.canvas.height / 2 - 15,
  color: 'white',
  width: 20,
  height: 80,
  score: 0,
});

let opponent = kontra.sprite({
  x: 10,
  y: kontra.canvas.height / 2 - 15,
  color: 'white',
  width: 20,
  height: 80,
  score: 0,
});

let ball = kontra.sprite({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2,
  color: 'red',
  radius: 8,
  dx: 4,
  dy: 4,
});

// Custom rendering
ball.render = () => {
  kontra.context.fillStyle = ball.color;
  kontra.context.beginPath();
  kontra.context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
  kontra.context.fill();
};

ball.reset = () => {
  ball.x = kontra.canvas.width / 2;
  ball.y = kontra.canvas.height / 2;
  let randomX = Math.floor(Math.random() * 10) + 1;
  let randomY = Math.floor(Math.random() * 10) + 1;
  if (randomX > 5) {
    ball.dx = 2;
  } else {
    ball.dx = -2;
  }

  if (randomY > 5) {
    ball.dy = 2;
  } else {
    ball.dy = -2;
  }
}

let loop = kontra.gameLoop({
  update: () => {
    player.update();
    opponent.update()
    ball.update();

    // Check point score
    if (ball.x > player.x + player.width) {
      opponent.score += 1;
      ball.reset();
    } else if (ball.x < opponent.x) {
      player.score += 1;
      ball.reset();
    }

    // Collision with player and opponent
    if ((ball.x + ball.radius >= player.x &&
      (ball.y + ball.radius <= (player.y + player.height) && (ball.y + ball.radius >= player.y))) ||
      ((ball.x <= opponent.x + opponent.width) &&
        (ball.y <= (opponent.y + opponent.height) && (ball.y + ball.radius >= opponent.y)))) {
      ball.dx *= -1;
    }

    // Move sprite based on key presses
    if (kontra.keys.pressed('up') && player.y >= 0) {
      player.y -= 4;
    } else if (kontra.keys.pressed('down') && (player.y + player.height) <= kontra.canvas.height) {
      player.y += 4;
    }

    // Move ball around
    if ((ball.y + ball.radius >= kontra.canvas.height) || (ball.y - ball.radius <= 0)) {
      ball.dy *= -1;
    }

    // Move opponent if ball is close by
    if (ball.x < kontra.canvas.width / 3) {
      if (ball.y < opponent.y) {
        opponent.y -= 4;
      } else if (ball.y > opponent.y + opponent.height) {
        opponent.y += 4;
      }
    }
  },

  render: () => {
    player.render();
    opponent.render();
    ball.render();

    kontra.context.font = '40px Helvetica, Verdana, san-serif';
    kontra.context.fillStyle = '#efe343';
    kontra.context.fillText(player.score, player.x - 40, kontra.canvas.height / 6);
    kontra.context.fillText(opponent.score, opponent.x + 40, kontra.canvas.height / 6);
  }
});

loop.start();
