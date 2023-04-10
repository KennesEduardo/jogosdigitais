import { Scene } from "phaser";

export default class Primeira extends Scene {
    p2;

    constructor() {
        //chamar o construtor da classe mãe
        //Passar o nome  unico desta cena
        super('primeira');
    }

    //Careega seus arquivos para uso (imgaens, cons etc)
    preload() {
        this.load.image('plataforma', 'assets/ground_grass.png');
        // this.load.image('coelhoParado', 'assets/bunny1_stand.png')
    }

    // inicializa os objestos gratifos na tela
    create() {        //x, y  referencia       
        const p = this.add.image(240, 320, 'plataforma'); //240,467
        // this.add.image(240, 320, 'coelhoParado')
        p.setScale(.5); //altera a escala
        p.x = 100; //mexe na posição x
        p.y = 200; // mexe na posição y
        // // p.rotation = 45; //rotação
        p.angle = 20;

        this.p2 = this.add.image(240, 320, 'plataforma')
        .setScale(.5)
        .setAngle(15);
    }

    // Chamado a cada atualização
    update(time, delta) {
        this.p2.angle +=3;
        this.p2.x -= 1;
        if (this.p2.x < 0){
            this.p2.x +=600;
        }
    }
}
