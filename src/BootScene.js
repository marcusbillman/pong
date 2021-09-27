import Phaser from "phaser";
import net from "./assets/net.png";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "boot" });
  }

  preload() {
    var bg = this.add.rectangle(400, 300, 400, 30, 0x666666);

    this.load.image("net", net);

    var bar = this.add
      .rectangle(bg.x, bg.y, bg.width, bg.height, 0xffffff)
      .setScale(0, 1);
  }

  update() {
    this.scene.start("menu");
    // this.scene.start('play');
    // this.scene.remove();
  }
}
