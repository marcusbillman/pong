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
    let ball = this.add.rectangle(
      gameConfig.width / 2,
      this.getStartingY(),
      20,
      20,
      0xffffff
    );

    const ballVector = this.getStartingVector();

    this.physics.add
      .existing(ball)
      .body.setVelocity(ballVector.x, ballVector.y)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);
  }

  update() {}

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
