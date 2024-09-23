import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.vidaActual = 10; // Establecer la vida inicial
        this.vidaMaxima = 10; // Establecer la vida máxima

        this.vidaActualMagnus = 10; // Vida inicial de Magnus
        this.vidaMaximaMagnus = 10; // Vida máxima de Magnus
    }

    create() {
        this.cameras.main.setBackgroundColor(0x006400);

        // Crear a Alaric
        this.player1 = this.physics.add.sprite(100, 900, "Alaric");
        this.player1.setScale(1);
        this.player1.setBounce(0);
        this.player1.setCollideWorldBounds(true);

        // Crear las teclas de entrada para AWSD
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Crear a Magnus
        this.player2 = this.physics.add.sprite(900, 100, "Magnus");
        this.player2.setScale(1);
        this.player2.setBounce(0);
        this.player2.setCollideWorldBounds(true);

        // Crear las teclas de entrada para las flechas del teclado (Magnus)
        this.cursors2 = this.input.keyboard.createCursorKeys();

        // Colisiones entre jugadores
        this.physics.add.collider(this.player1, this.player2);

        // Crear un cuadrado inmóvil
        this.cuadrado = this.add.rectangle(500, 400, 300, 300, 0x6666ff);
        this.physics.add.existing(this.cuadrado);
        this.physics.add.collider(this.player1, this.cuadrado);
        this.physics.add.collider(this.player2, this.cuadrado);
        this.cuadrado.body.setImmovable(true);

        // Escuchar la barra espaciadora para Alaric
        this.input.keyboard.on('keydown-SPACE', this.ataqueAlaric, this);

        // Escuchar el clic izquierdo del ratón para Magnus
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.ataqueMagnus();
            }
        }, this);

        // Crear un grupo de ataques
        this.ataques = this.physics.add.group();

        // Vida de Alaric
        this.vidaAlaric = this.add.sprite(100, 50, 'barraVida', 0);

        // Vida de Magnus
        this.vidaMagnus = this.add.sprite(900, 50, 'barraVida', 0);
    }

    update() {
        // Movimiento de Alaric
        this.player1.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player1.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.player1.setVelocityX(350);
        }
        if (this.cursors.up.isDown) {
            this.player1.setVelocityY(-350);
        } else if (this.cursors.down.isDown) {
            this.player1.setVelocityY(350);
        }

        // Movimiento de Magnus
        this.player2.setVelocity(0);
        if (this.cursors2.left.isDown) {
            this.player2.setVelocityX(-350);
        } else if (this.cursors2.right.isDown) {
            this.player2.setVelocityX(350);
        }
        if (this.cursors2.up.isDown) {
            this.player2.setVelocityY(-350);
        } else if (this.cursors2.down.isDown) {
            this.player2.setVelocityY(350);
        }

        // Verificar colisiones entre ataques de Alaric y Magnus
        this.ataques.children.iterate((ataque) => {
            if (ataque) {
                if (this.physics.overlap(ataque, this.player2) && ataque.getData('owner') === 'Alaric') {
                    ataque.destroy();
                    console.log("¡Alaric golpeó a Magnus!");
                    this.recibeDañoMagnus(); // Magnus recibe daño
                } else if (this.physics.overlap(ataque, this.player1) && ataque.getData('owner') === 'Magnus') {
                    ataque.destroy();
                    console.log("¡Magnus golpeó a Alaric!");
                    this.recibeDaño(); // Alaric recibe daño
                }
            }
        });
    }

    ataqueAlaric() {
        const ataque1 = this.ataques.create(this.player1.x, this.player1.y, 'ataque');
        ataque1.setData('owner', 'Alaric'); // Etiquetar el ataque
        const direction = new Phaser.Math.Vector2(this.player2.x - this.player1.x, this.player2.y - this.player1.y);
        direction.normalize();
        ataque1.setVelocity(direction.x * 500, direction.y * 500);
        ataque1.setScale(0.1);
        console.log("Alaric ataca!");
    }
    
    ataqueMagnus() {
        const ataque = this.ataques.create(this.player2.x, this.player2.y, 'ataque');
        ataque.setData('owner', 'Magnus'); // Etiquetar el ataque
        const direction = new Phaser.Math.Vector2(this.player1.x - this.player2.x, this.player1.y - this.player2.y);
        direction.normalize();
        ataque.setVelocity(direction.x * 500, direction.y * 500);
        ataque.setScale(0.1);
        console.log("Magnus ataca!");
    }

    recibeDaño() {
        this.vidaActual--; // Disminuye la vida de Alaric
        this.updateVida(); // Actualiza la barra de vida
        console.log("Alaric recibe daño! Vida actual:", this.vidaActual);
    
        // Verificar si Alaric ha llegado a 0 vida
        if (this.vidaActual <= 0) {
            this.scene.start('GameOver'); // Cambia a la escena de Game Over
        }
    }
    updateVida() {
        const frameIndex = 10 - this.vidaActual; // Asumiendo que hay 11 frames, de 0 a 10
        this.vidaAlaric.setFrame(frameIndex); // Cambia al siguiente frame
    }

    recibeDañoMagnus() {
        this.vidaActualMagnus--;
        this.updateVidaMagnus();
        console.log("Magnus recibe daño! Vida actual:", this.vidaActualMagnus);
    
        // Verificar si Magnus ha llegado a 0 vida
        if (this.vidaActualMagnus <= 0) {
            this.scene.start('GameOver'); // Cambia a la escena de Game Over
        }
    }

    updateVidaMagnus() {
        const frameIndex = 10 - this.vidaActualMagnus; // Asumiendo que hay 11 frames
        this.vidaMagnus.setFrame(frameIndex);
    }
}
