import { Math, Scene } from "phaser";
import Moeda from "../objects/moeda";


export default class Level extends Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    canoCimas;
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    canoBaixos;
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors;
    /**@type {Phaser.Physics.Arcade.Group} */
    moedas;

    constructor(){
        super('level')
    }

    preload(){
        this.load.image('fundo', 'public/assets/fundo1.png');
        this.load.image('canoCima', 'assets/canoCima.png');
        this.load.image('canoBaixo', 'assets/canoBaixo.png');
        this.load.image('flappy-stand', 'assets/flappy.png');
        this.load.image('flappy-jump', 'assets/flappy1.png');
        this.load.image('moeda', 'assets/moeda.png');

        this.load.audio('flayp', 'assets/flap.wav');
        this.load.audio('gameOver', 'assets/ground-hit.wav');

      
        
    }

    create(){
        //background
        this.add.image(350,170, 'fundo')
        .setScrollFactor(0,0);
        
        // Grupro de plataformas
        this.canoCimas = this.physics.add.staticGroup();
        this.canoBaixos = this.physics.add.staticGroup();  

        for (let i = 0; i < 5; i++) {
            const x = 200 * i;
            const y = Math.Between(320, 500);

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const canoBaixo= this.canoBaixos.create(x, y, 'canoBaixo');
            canoBaixo.setScale(1.5);
            canoBaixo.setOrigin(0.5, 0);
            canoBaixo.body.updateFromGameObject();

            const canoCima = this.canoCimas.create(x, y - 150, 'canoCima');
            canoCima.setScale(1.5);
            canoCima.setOrigin(0.5, 1);
            canoCima.body.updateFromGameObject();
        }

        // Criando o player(coelho)
        this.player = this.physics.add.image(250,300, 'flappy-stand')
            .setScale(.05);
        
        
        //Player velocity
        this.player.setVelocityX(100); 

        //Camera
        this.cameras.main.startFollow(this.player);
    
         //Player dead Zone
        this.cameras.main.setDeadzone(undefined ,this.scale.x-200);

        this.cursors = this.input.keyboard.createCursorKeys();

        //criando moeda
     
        this.moedas = this.physics.add.group({
            classType: Moeda
        });

        this.physics.add.overlap(this.player, this.moedas, undefined, this);


        //faz os elementos colidirem
        this.physics.add.collider(this.player, this.canoCimas, () => {
            this.scene.start('game-over');
        });
        
        this.physics.add.collider(this.player, this.canoBaixos, () => {
            this.scene.start('game-over');
        });
        this.player.body.checkCollision.right = true;
        this.player.body.checkCollision.up = true;
        this.player.body.checkCollision.down = true;


    }

    update(time, delta) {

        if(this.cursors.space.isDown){
            this.player.setVelocityY(-50);
            this.player.setTexture('flappy-jump')
                .setScale(.03)
            this.sound.play('flayp');

        }else{
            this.player.setTexture('flappy-stand')
                .setScale(.05)
        }


         //reaproveitando os canos
         this.canoCimas.children.iterate( child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const canoCima = child;

            // Position canos no eixo X
            const scrollX = this.cameras.main.scrollX;
            console.log(scrollX)
            if( canoCima.x + 200 <= scrollX){
                canoCima.y +150 <= Math.Between(320,500);
                canoCima.x = scrollX + 870;
                canoCima.body.updateFromGameObject();

            }
        })
        this.canoBaixos.children.iterate( child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const canoBaixo = child;

            // Position pipes X
            const scrollX = this.cameras.main.scrollX;
            console.log(scrollX)
            if( canoBaixo.x + 200 <= scrollX){ 
                canoBaixo.y -150 <= Math.Between(320,500)
                canoBaixo.x = scrollX + 870;
                canoBaixo.body.updateFromGameObject();

            }
        })

    }

    // addCarrotAbove(platform){
    //     //arrumando posicionamento onde cenora vai inicar
    //     const y = platform.y - platform.displayHeight;

    //     const carrot = this.carrots.get(platform.x, y, 'carrot');

    //     carrot.setActive(true);
    //     carrot.setVisible(true);

    //     this.add.existing(carrot);

    //     carrot.body.setSize(carrot.width, carrot.height);
    //     this.physics.world.enable(carrot);
    // }

}