import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x006400); // Verde oscuro en hexadecimal

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
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
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

        // Grupo para los ataques
        this.ataques = this.physics.add.group();

        // Listener para el clic izquierdo del mouse (ataque de Magnus)
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.lanzarAtaque(this.player2); // Magnus ataca a Alaric
            }
        });
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

        // Ataque de Alaric con barra espaciadora
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.lanzarAtaque(this.player1); // Alaric ataca a Magnus
        }
    }

    lanzarAtaque(atacante) {
        // Crear la imagen del ataque en la posición del atacante
        let ataque = this.ataques.create(atacante.x, atacante.y, 'ataque');
        ataque.setScale(0.1); // Ajusta el tamaño si es necesario
        this.physics.add.existing(ataque); // Asegúrate de que el ataque tiene un cuerpo físico

        // Determinar la dirección del ataque basada en la velocidad actual del atacante
        const direction = new Phaser.Math.Vector2(atacante.body.velocity.x, atacante.body.velocity.y);

        // Normalizar la dirección y aplicar velocidad
        if (direction.length() > 0) {
            direction.normalize(); // Normaliza el vector para obtener una dirección
        } else {
            direction.set(1, 0); // Si no se mueve, lanzar hacia la derecha por defecto
        }

        const speed = 900; // Ajusta la velocidad según sea necesario
        ataque.body.setVelocity(direction.x * speed, direction.y * speed);
        ataque.body.setCollideWorldBounds(true);

        // Destruir el ataque después de 2 segundos
        this.time.delayedCall(2000, () => {
            ataque.destroy();
        });
    }
}
