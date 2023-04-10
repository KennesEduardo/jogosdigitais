import { Math, Scene } from "phaser";
import Carrot from "../objects/Carrot";


export default class Level extends Scene {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

    /**@type {Phaser.Physics.Arcade.StaticGroup} */
    platform;

    /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors;

    /**@type {Phaser.Physics.Arcade.Group} */
    carrots;

    points = 0;
    /** @type {Phaser.GameObjects.Text} */
    pointsText;

    constructor(){
        super('level')
    }

    preload(){
        this.load.image('background', 'assets/bg_layer1.png');
        this.load.image('platform', 'assets/ground_grass.png');
        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
        this.load.image('bunny-jump', 'assets/bunny1_jump.png');
        this.load.image('carrot', 'assets/carrot.png');

        this.load.audio("jump", 'assets/sfx/jump.ogg' );
        this.load.audio("gameover", 'assets/sfx/gameover.ogg' );
        this.load.audio("eat", 'assets/sfx/eat.ogg' );
        
    }

    create(){
        //background
        this.add.image(240,320, 'background')
        .setScrollFactor(0,0);
        
        // Grupro de plataformas
        this.platforms = this.physics.add.staticGroup();    

        for (let i = 0; i < 5; i++){
            const x = Math.Between(80,400);
            const y = 150 * i;

            //adiciona plataforma dentro do grupo plataformas
            const platform = this.platforms.create(x, y, 'platform')
            .setScale(.5)
            platform.body.updateFromGameObject();
        }

        // Criando o player(coelho)
        this.player = this.physics.add.image(240,120, 'bunny-stand')
            .setScale(.5);
        
        //faz os elementos colidirem
        this.physics.add.collider(this.player, this.platforms);
        
        // disabilitar a colisão do coelho em cima e nas laterais
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        // criando a camera 
        this.cameras.main.startFollow(this.player);

        // Definir uma dead zone para a Câmera
        this.cameras.main.setDeadzone(this.scale.width * 1.5);
        
        //criando Cursores
        this.cursors = this.input.keyboard.createCursorKeys();

        //cenouras 
        this.carrots = this.physics.add.group({
            classType: Carrot
        });

        this.physics.add.collider(this.carrots, this.platforms);

        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);

        //criando cenora de outra forma
        // const cenora = new Carrot(this, 100, 300, 'carrot')
        // this.add.existing(cenora);

                //texto de Pontuação
        const style = {color: '#000', fontSize: 24};
        this.pointsText = this.add.text(240, 10, 'Cenouras: 0', style);
        this.pointsText.setScrollFactor(0);
        this.pointsText.setOrigin(0.5,0);
    }

    update(time, delta) {
        //pulando
        const touchingGround = this.player.body.touching.down;
        console.log(touchingGround);

        if( touchingGround) {
            this.player.setVelocityY(-310);
            this.sound.play('jump');

            //mudar a imagem do coelho
            this.player.setTexture('bunny-jump');
        }

        let setVelocityY = this.player.body.velocity.y;
        if(setVelocityY > 0 && this.player.texture.key !== 'bunny-stand') {
            this.player.setTexture('bunny-stand');
            
        }

        // Reutilizando as plataformas 
        this.platforms.children.iterate( child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;

            //pegar a posição y da camera
            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 700) {
                platform.x = Math.Between(80,400);
                platform.y = scrollY - Math.Between(0,10);
                platform.body.updateFromGameObject();

                //criar uma cenora acima
                this.addCarrotAbove(platform);
            }
        });

        //cursores Direita e Esquerda
        if( this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setAccelerationX(200);
        } else {
            this.player.setVelocityX(0);
        }

        let bottomPlatform = this.findBottomPlatform();
        if (this.player.y > bottomPlatform.y + 200) {
            console.log('GAME OVER')
            //ir para cena
            this.scene.start('game-over');
            this.sound.play('gameover');
           
        }




    }

    addCarrotAbove(platform){
        //arrumando posicionamento onde cenora vai inicar
        const y = platform.y - platform.displayHeight;

        const carrot = this.carrots.get(platform.x, y, 'carrot');

        carrot.setActive(true);
        carrot.setVisible(true);

        this.add.existing(carrot);

        carrot.body.setSize(carrot.width, carrot.height);
        this.physics.world.enable(carrot);
    }

    //acão para cenora desaparecer quando tocada
    handleCollectCarrot(player, carrot) {
        this.carrots.killAndHide(carrot);
        
        this.physics.world.disableBody(carrot.body);

        this.points++;
        this.pointsText.text = 'Cenouras:' + this.points;
        this.sound.play('eat');
    }

    //Procurando a plataforma mais baixa
    findBottomPlatform() {
        let platforms = this.platforms.getChildren();
        let bottomPlatform = platforms[0];
        
        for (let i = 1; i < platforms.length; i++) {
            let platform = platforms[i];

            if(platform.y <  bottomPlatform.y) {
                continue;
            }
            
            bottomPlatform = platform;
        }

        return bottomPlatform;
    }
}