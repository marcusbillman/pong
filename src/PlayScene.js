import Phaser from "phaser";
import gameConfig from "./gameConfig";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
      physics: {
        arcade: {
          debug: false,
        },
      },
    });
  }

  create() {
    this.state = {
      player1Score: 0,
      player2Score: 0,
      lastWinner: 1,
    };

    // Ball
    this.ball = this.add.rectangle(
      gameConfig.width / 2,
      -Infinity,
      20,
      20,
      0xffffff
    );

    this.physics.add
      .existing(this.ball)
      .body.setBounce(1, 1)
      .setCollideWorldBounds(true);

    // Paddle 1 (Human player)
    this.paddle1 = this.add.rectangle(
      40,
      gameConfig.height / 2,
      20,
      100,
      0xffffff
    );

    // Paddle 2 (AI player)
    this.paddle2 = this.add.rectangle(
      gameConfig.width - 40,
      gameConfig.height / 2,
      20,
      100,
      0xffffff
    );

    // Add paddles to physics group
    this.paddles = this.physics.add
      .group()
      .addMultiple([this.paddle1, this.paddle2]);

    this.paddles.getChildren().forEach((paddle) => {
      paddle.body.setImmovable(true).setCollideWorldBounds(true);
    });

    // Ball-paddle collision detection
    this.physics.add.collider(
      this.ball,
      this.paddles,
      this.onBallPaddleCollision,
      null,
      this
    );

    // Goal 1
    this.goal1 = this.add
      .rectangle(-this.ball.width, 0, 1, gameConfig.height)
      .setOrigin(1, 0);

    // Goal 2
    this.goal2 = this.add
      .rectangle(gameConfig.width + this.ball.width, 0, 1, gameConfig.height)
      .setOrigin(0, 0);

    // Add goals to physics group
    this.goals = this.physics.add
      .staticGroup()
      .addMultiple([this.goal1, this.goal2]);

    // Ball-goal collision detection
    this.physics.add.collider(
      this.ball,
      this.goals,
      this.onBallGoalCollision,
      null,
      this
    );

    // Ball should only collide with top and bottom world bounds
    this.physics.world.setBoundsCollision(false, false, true, true);

    // Score counter text 1
    this.scoreText1 = this.add.text(0, 50, "0", {
      fontFamily: '"Press Start 2P", sans-serif',
      fontSize: 64,
      fixedWidth: gameConfig.width / 2,
      align: "center",
    });

    // Score counter text 2
    this.scoreText2 = this.add.text(gameConfig.width / 2, 50, "0", {
      fontFamily: '"Press Start 2P", sans-serif',
      fontSize: 64,
      fixedWidth: gameConfig.width / 2,
      align: "center",
    });

    // Set up keyboard input
    this.keys = this.input.keyboard.addKeys("up, down, w, s, r");

    // Serve ball (start round)
    this.serve();
  }

  serve() {
    this.ball.x = gameConfig.width / 2;
    this.ball.y = this.getStartingY();
    const ballVector = this.getStartingVector();
    this.ball.body.setVelocity(ballVector.x, ballVector.y);
  }

  onBallPaddleCollision(ball, paddle) {
    // Calculate the fraction, which represents where on the paddle the ball collided
    // 0 is at the top of the paddle, 1 is at the bottom
    let distanceFromCenter = ball.y - paddle.y;
    let distanceFromTop = distanceFromCenter + paddle.height / 2;
    let fraction = distanceFromTop / paddle.height;

    // Get the old velocity vector and calculate the speed using the distance formula
    const oldVelocity = ball.body.velocity;
    const speed = Math.sqrt(oldVelocity.x ** 2 + oldVelocity.y ** 2);

    // Calculate the new angle between -45 and 45 degrees depending on the fraction
    // Flip the angle horizontally if bouncing on the right paddle
    let newAngle = fraction * 90 - 45;
    if (ball.x > gameConfig.width / 2) {
      newAngle = -180 - newAngle;
    }

    // Get the new velocity using the new angle and the same speed as before the bounce
    let newVelocity = this.physics.velocityFromAngle(newAngle, speed);
    ball.body.setVelocity(newVelocity.x, newVelocity.y);
  }

  onBallGoalCollision(ball, goal) {
    ball.body.stop();
    if (ball.x > gameConfig.width / 2) {
      this.state.player1Score++;
      this.state.lastWinner = 1;
    } else {
      this.state.player2Score++;
      this.state.lastWinner = 2;
    }
    this.scoreText1.setText(this.state.player1Score);
    this.scoreText2.setText(this.state.player2Score);
    console.log(this.state);
    this.time.delayedCall(1000, this.serve, null, this);
  }

  update(time) {
    if (this.keys.up.isDown || this.keys.w.isDown) {
      this.paddle1.body.setVelocityY(-500);
    } else if (this.keys.down.isDown || this.keys.s.isDown) {
      this.paddle1.body.setVelocityY(500);
    } else {
      this.paddle1.body.setVelocityY(0);
    }

    // "AI" for paddle 2 movement
    if (this.ball.body.velocity.x > 0 && time % 200 < 10) {
      let distanceY = this.paddle2.y - this.ball.y;
      let distanceThreshold = Math.random() * 50 + 30;
      if (distanceY > distanceThreshold) {
        this.paddle2.body.setVelocityY(-500);
      } else if (distanceY < -distanceThreshold) {
        this.paddle2.body.setVelocityY(500);
      } else {
        this.paddle2.body.setVelocityY(0);
      }
    }

    // Reset key for debugging
    if (this.keys.r.isDown) this.scene.restart();
  }

  getStartingY() {
    return Math.random() * gameConfig.height;
  }

  getStartingVector() {
    let x = Math.random() * 200 + 200;
    if (this.state.lastWinner === 2) x *= -1;
    const y = Math.random() * 800 - 400;

    return { x, y };
  }

  getRotatedVector(vector, radians) {
    let result = {};
    result.x = vector.x * Math.cos(radians) - vector.y * Math.sin(radians);
    result.y = vector.x * Math.sin(radians) + vector.y * Math.cos(radians);
    return result;
  }
}
