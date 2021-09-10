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

  state = {
    player1Score: 0,
    player2Score: 0,
    lastWinner: 1,
  };

  create() {
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
      this.onBallPaddleCollision
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

    // Set up keyboard input
    this.keys = this.input.keyboard.addKeys("up, down, w, s, r");

    // Serve ball (start round)
    this.serve();
  }

  serve() {
    this.ball.y = this.getStartingY();
    const ballVector = this.getStartingVector();
    this.ball.body.setVelocity(ballVector.x, ballVector.y);
  }

  onBallPaddleCollision() {}

  onBallGoalCollision(ball, goal) {
    ball.body.stop();
  }

  update() {
    if (this.keys.up.isDown || this.keys.w.isDown) {
      this.paddle1.body.setVelocityY(-500);
    } else if (this.keys.down.isDown || this.keys.s.isDown) {
      this.paddle1.body.setVelocityY(500);
    } else {
      this.paddle1.body.setVelocityY(0);
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
}
