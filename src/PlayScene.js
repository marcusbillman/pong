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
      gameConfig.height / 2,
      20,
      20,
      0xffffff
    );
    this.physics.add
      .existing(ball)
      .body.setVelocity(200, 100) // TODO: Randomize velocity
      .setBounce(1, 1)
      .setCollideWorldBounds(true);
  }

  update() {}
}
