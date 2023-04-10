import { AUTO, Scene } from "phaser";

export default class GameOver extends Scene {
    constructor() {
        super('game-over');
    }

    preload() {
        this.load.image('fundoGameOver', 'public/assets/fundoGameover.png');
        this.load.image('GameOver', 'public/assets/gameover.png');
        
    }

    create() {
        this.add.image(240, 320, 'fundoGameOver')
            .setScale(3)
 
        let width = this.scale.width;
        let hight = this.scale.height;

        this.add.image(320, 200, 'GameOver')
        .setScale(1.5)


        this.add.text(width/2, hight/2, 'PRECIONE TECLA ESPAÇO PARA JOGAR NOVAMENTE', {
            fontSize: 24,
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0);

        //New Game
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('level');
        });
    }
}