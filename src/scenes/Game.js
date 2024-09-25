import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.initVariables();
    }

    initVariables() {
        this.vidaActual = 10; // Vida inicial de Alaric
        this.vidaActualMagnus = 10; // Vida inicial de Magnus
        this.victoriasAlaric = 0; // Contador de victorias de Alaric
        this.victoriasMagnus = 0; // Contador de victorias de Magnus
        this.rondasGanadas = 2; // Número de rondas necesarias para ganar
    }

    create() {
        this.cameras.main.setBackgroundColor(0x006400);
        
        // Crear animaciones para Alaric
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers("alaric_walk", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Crear animaciones para Magnus
        this.anims.create({
            key: 'move_magnus',
            frames: this.anims.generateFrameNumbers("magnus_walk", { start: 0, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        // Crear a Alaric
        this.player1 = this.physics.add.sprite(100, 900, "alaric_walk");
        this.player1.setScale(1);
        this.player1.setBounce(0);
        this.player1.setCollideWorldBounds(true);
        this.player1.play('move');

        // Crear animaciones de caminar para Alaric
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('alaric_walk', { start: 4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('alaric_walk', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        // Crear a Magnus
        this.player2 = this.physics.add.sprite(900, 100, "magnus_walk");
        this.player2.setScale(1);
        this.player2.setBounce(0);
        this.player2.setCollideWorldBounds(true);
        this.player2.play('move_magnus');

        // Crear animaciones de caminar para Magnus
        this.anims.create({
            key: 'walk_right_magnus',
            frames: this.anims.generateFrameNumbers('magnus_walk', { start: 4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_left_magnus',
            frames: this.anims.generateFrameNumbers('magnus_walk', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        // Configurar controles
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.cursors2 = this.input.keyboard.createCursorKeys();

        // Colisiones entre jugadores
        this.physics.add.collider(this.player1, this.player2);

        // Crear un cuadrado inmóvil
        this.cuadrado = this.add.rectangle(500, 400, 300, 300, 0x6666ff);
        this.physics.add.existing(this.cuadrado);
        this.physics.add.collider(this.player1, this.cuadrado);
        this.physics.add.collider(this.player2, this.cuadrado);
        this.cuadrado.body.setImmovable(true);

        // Escuchar ataques
        this.input.keyboard.on('keydown-SPACE', this.ataqueAlaric, this);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.ataqueMagnus();
            }
        }, this);

        // Crear grupo de ataques
        this.ataques = this.physics.add.group();

        // Vida de Alaric
        this.vidaAlaric = this.add.sprite(100, 50, 'barraVida', 0);
        this.textoAlaric = this.add.text(100, 30, 'ALARIC', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Vida de Magnus
        this.vidaMagnus = this.add.sprite(900, 50, 'barraVida', 0);
        this.textoMagnus = this.add.text(900, 30, 'MAGNUS', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Mostrar el texto de victorias
        this.textoVictorias = this.add.text(400, 20, 'Alaric: 0 - Magnus: 0', {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5, 0.5);

        // Inicializar vida y victorias
        this.resetRound();
    }

    update() {
        // Movimiento de Alaric
        if (this.cursors.right.isDown) {
            this.player1.setVelocityX(350);
            this.player1.anims.play('walk_right', true);
        } else if (this.cursors.left.isDown) {
            this.player1.setVelocityX(-350);
            this.player1.anims.play('walk_left', true);
        } else {
            this.player1.setVelocityX(0);
            this.player1.anims.stop();
        }

        if (this.cursors.up.isDown) {
            this.player1.setVelocityY(-350);
        } else if (this.cursors.down.isDown) {
            this.player1.setVelocityY(350);
        } else {
            this.player1.setVelocityY(0);
        }

        // Movimiento de Magnus
        if (this.cursors2.right.isDown) {
            this.player2.setVelocityX(350);
            this.player2.anims.play('walk_right_magnus', true);
        } else if (this.cursors2.left.isDown) {
            this.player2.setVelocityX(-350);
            this.player2.anims.play('walk_left_magnus', true);
        } else {
            this.player2.setVelocityX(0);
            this.player2.anims.stop();
        }

        if (this.cursors2.up.isDown) {
            this.player2.setVelocityY(-350);
        } else if (this.cursors2.down.isDown) {
            this.player2.setVelocityY(350);
        } else {
            this.player2.setVelocityY(0);
        }

        // Verificar colisiones entre ataques
        this.ataques.children.iterate((ataque) => {
            if (ataque) {
                if (this.physics.overlap(ataque, this.player2) && ataque.getData('owner') === 'Alaric') {
                    ataque.destroy();
                    this.recibeDañoMagnus();
                } else if (this.physics.overlap(ataque, this.player1) && ataque.getData('owner') === 'Magnus') {
                    ataque.destroy();
                    this.recibeDaño();
                }
            }
        });
    }

    ataqueAlaric() {
        const ataque1 = this.ataques.create(this.player1.x, this.player1.y, 'ataque');
        ataque1.setData('owner', 'Alaric');
        const direction = new Phaser.Math.Vector2(this.player2.x - this.player1.x, this.player2.y - this.player1.y);
        direction.normalize();
        ataque1.setVelocity(direction.x * 500, direction.y * 500);
        ataque1.setScale(0.1);
        console.log("Alaric ataca!");
    }

    ataqueMagnus() {
        const ataque = this.ataques.create(this.player2.x, this.player2.y, 'ataque');
        ataque.setData('owner', 'Magnus');
        const direction = new Phaser.Math.Vector2(this.player1.x - this.player2.x, this.player1.y - this.player2.y);
        direction.normalize();
        ataque.setVelocity(direction.x * 500, direction.y * 500);
        ataque.setScale(0.1);
        console.log("Magnus ataca!");
    }

    recibeDaño() {
        this.vidaActual--;
        this.updateVida();
        console.log("Alaric recibe daño! Vida actual:", this.vidaActual);
        this.checkForGameOver(); // Verificar si Alaric ha perdido
    }

    recibeDañoMagnus() {
        this.vidaActualMagnus--;
        this.updateVidaMagnus();
        console.log("Magnus recibe daño! Vida actual:", this.vidaActualMagnus);
        this.checkForGameOver(); // Verificar si Magnus ha perdido
    }

    checkForGameOver() {
        if (this.vidaActual <= 0) {
            this.victoriasMagnus++;
            this.resetRound();
        } else if (this.vidaActualMagnus <= 0) {
            this.victoriasAlaric++;
            this.resetRound();
        }

        // Verifica si alguien ha ganado el juego
        if (this.victoriasAlaric >= this.rondasGanadas || this.victoriasMagnus >= this.rondasGanadas) {
            this.scene.start('GameOver'); // Cambia a la escena GameOver
        }
    }

    resetRound() {
        this.vidaActual = 10;
        this.vidaActualMagnus = 10;
        this.updateVida();
        this.updateVidaMagnus();

        // Actualiza el texto de victorias
        this.textoVictorias.setText(`Alaric: ${this.victoriasAlaric} - Magnus: ${this.victoriasMagnus}`);
    }

    updateVida() {
        const frameIndex = 10 - this.vidaActual; // Asumiendo que hay 11 frames
        this.vidaAlaric.setFrame(frameIndex);
    }

    updateVidaMagnus() {
        const frameIndex = 10 - this.vidaActualMagnus; // Asumiendo que hay 11 frames
        this.vidaMagnus.setFrame(frameIndex);
    }
}
