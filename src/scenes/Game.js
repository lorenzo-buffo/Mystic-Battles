import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create (){
        this.cameras.main.setBackgroundColor(0x006400); // Verde oscuro en hexadecimal

        //Crear a Alaric
        this.player1 = this.physics.add.sprite(100, 900, "Alaric");
        this.player1.setScale(2); 
        this.player1.setBounce(0 );
        this.player1.setCollideWorldBounds(true);

        //Crear las teclas de entrada para AWSD
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        //Crear a Magnus
        this.player2 = this.physics.add.sprite(900, 100, "Magnus");
        this.player2.setScale(2); 
        this.player2.setBounce(0 );
        this.player2.setCollideWorldBounds(true);

        // Crear las teclas de entrada para las flechas del teclado (Magnus)
        this.cursors2 = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player1, this.player2);

        this.cuadrado = this.add.rectangle(500, 400, 300, 300,0x6666ff);
        this.physics.add.existing(this.cuadrado);
        this.physics.add.collider(this.player1, this.cuadrado);
        this.physics.add.collider(this.player2, this.cuadrado);
        this.cuadrado.body.setImmovable(true);
        
    }

    update () {
        //REINICIAR LA VELOCIDAD HORIZONTAL Y VERTICAL DE ALARIC
        this.player1.setVelocity(0);
        //Movimiento Alaric hacia la izquierda
        if (this.cursors.left.isDown) {
            this.player1.setVelocityX(-300);
        }
        //Movimiento Alaric hacia la derecha
        else if (this.cursors.right.isDown) {
            this.player1.setVelocityX(300);
        }
        //Movimiento Alaric hacia arriba
        if (this.cursors.up.isDown) {
            this.player1.setVelocityY(-300);
        }
        //Movimiento Alaric hacia abajo
        else if (this.cursors.down.isDown) {
            this.player1.setVelocityY(300);
        }

        //REINICIAR LA VELOCIDAD HORIZONTAL Y VERTICAL DE MAGNUS
        this.player2.setVelocity(0);
        // Movimiento de Magnus hacia la izquierda
        if (this.cursors2.left.isDown) {
            this.player2.setVelocityX(-300);
        }
        // Movimiento de Magnus hacia la derecha
        else if (this.cursors2.right.isDown) {
            this.player2.setVelocityX(300);
        }
        // Movimiento de Magnus hacia arriba
        if (this.cursors2.up.isDown) {
            this.player2.setVelocityY(-300);
        }
        // Movimiento de Magnus hacia abajo
        else if (this.cursors2.down.isDown) {
            this.player2.setVelocityY(300);
        }
      }
    }

