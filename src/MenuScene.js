import Phaser from "phaser";
import gameConfig from "./gameConfig";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "menu" });
  }

  init(data) {
    this.state = data;
  }

  create() {
    let titleTextContent = "Pong";
    if (this.state.lastWinner) {
      let winnerName = this.state.lastWinner === 1 ? "Human" : "Computer";
      titleTextContent = `${winnerName} wins!\n${this.state.player1Score} - ${this.state.player2Score}`;
    }

    this.titleText = this.add
      .text(gameConfig.width / 2, 280, titleTextContent, {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: 32,
        align: "center",
        lineSpacing: 20,
      })
      .setOrigin(0.5, 1);

    this.instructionText = this.add
      .text(gameConfig.width / 2, 350, "Click to play", {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: 16,
      })
      .setOrigin(0.5, 0);

    this.creditText = this.add
      .text(gameConfig.width / 2, 500, "Made by Marcus Billman", {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: 16,
        fill: "#666666",
      })
      .setOrigin(0.5, 0);

    this.input.on(
      "pointerdown",
      function () {
        this.scene.start("play");
      },
      this
    );
  }
}
