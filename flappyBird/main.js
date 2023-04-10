import { AUTO, Game } from "phaser";
import Level from "./src/scenes/level";
import GameOver from "./src/scenes/GameOver";

const config = {
  width: 640, //largura
  height: 640, //altura
  type: AUTO,
  scene: [Level, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y:100
        
      },
      debug:true
    }
  }

}

new Game(config);