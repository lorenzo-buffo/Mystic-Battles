import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    initVariables() {
        this.vidaActual = 10;
        this.vidaActualMagnus = 10;
        this.victoriasAlaric = 0;
        this.victoriasMagnus = 0;
        this.rondasGanadas = 2;
        this.contador = 3;
        this.textoContador = null;
        this.enContador = true;
        this.puedeDisparar = true;
        this.puedeMoverse = true; // Inicializar aquí
        this.posicionAlaric = { x: 100, y: 900 };
        this.posicionMagnus = { x: 900, y: 100 };
    }

    create() {
        this.initVariables();

        this.cameras.main.setBackgroundColor(0x006400);
        this.player1 = this.physics.add.sprite(this.posicionAlaric.x, this.posicionAlaric.y, "alaric_walk");
        this.player1.setScale(1);
        this.player1.setBounce(0);
        this.player1.setCollideWorldBounds(true);
        this.player1.play('move');

        this.player2 = this.physics.add.sprite(this.posicionMagnus.x, this.posicionMagnus.y, "magnus_walk");
        this.player2.setScale(1);
        this.player2.setBounce(0);
        this.player2.setCollideWorldBounds(true);
        this.player2.play('move_magnus');

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.cursors2 = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player1, this.player2);
        this.cajas = this.physics.add.group();

        const tamañosCajas = [100, 100, 100, 100];
        const posicionesEsquinas = [
            { x: 150, y: 200 },
            { x: 850, y: 200 },
            { x: 150, y: 600 },
            { x: 850, y: 600 }
        ];

        posicionesEsquinas.forEach((pos, index) => {
            const caja = this.cajas.create(pos.x, pos.y, 'caja_spritesheet');
            caja.setImmovable(true);
            caja.setScale(1);
            caja.collisiones = 0;
            caja.setFrame(0);  // Inicializar la caja en el primer frame
        });
        
        const cajaCentro = this.cajas.create(500, 400, 'caja_spritesheet');
        cajaCentro.setImmovable(true);
        cajaCentro.setScale(2);
        cajaCentro.collisiones = 0;
        cajaCentro.setFrame(0);  // Inicializar la caja en el primer frame

        this.physics.add.collider(this.player1, this.cajas);
        this.physics.add.collider(this.player2, this.cajas);
        this.input.keyboard.on('keydown-SPACE', this.intentaAtaqueAlaric, this);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.intentaAtaqueMagnus();
            }
        }, this);

        this.ataques = this.physics.add.group();
        this.vidaAlaric = this.add.sprite(100, 50, 'barraVida', 0);
        this.textoAlaric = this.add.text(100, 30, 'ALARIC', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.vidaMagnus = this.add.sprite(900, 50, 'barraVida', 0);
        this.textoMagnus = this.add.text(900, 30, 'MAGNUS', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.textoVictorias = this.add.text(500, 20, 'Alaric: 0 - Magnus: 0', {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5, 0.5);

        this.resetRound();
    }

    update() {
        if (!this.puedeMoverse || this.enContador) {
            return; // No permitir movimiento
        }

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

        this.ataques.children.iterate((ataque) => {
            if (ataque) {
                this.physics.add.collider(ataque, this.cajas, (ataque, caja) => {
                    ataque.destroy();
                    caja.collisiones++;
                
                    if (caja.collisiones < 5) {
                        // Cambiar el frame de la caja para mostrar su daño
                        caja.setFrame(caja.collisiones);
                    } else {
                        // Destruir la caja si llega al número máximo de colisiones
                        caja.destroy();
                        this.generarPocion(caja.x, caja.y);  // Generar poción si la caja se destruye
                    }
                });

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

    intentaAtaqueAlaric() {
        if (this.puedeDisparar) {
            this.ataqueAlaric();
        }
    }

    intentaAtaqueMagnus() {
        if (this.puedeDisparar) {
            this.ataqueMagnus();
        }
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
        this.tintRed(this.player1);
        this.checkForGameOver();
    }

    recibeDañoMagnus() {
        this.vidaActualMagnus--;
        this.updateVidaMagnus();
        console.log("Magnus recibe daño! Vida actual:", this.vidaActualMagnus);
        this.tintRed(this.player2);
        this.checkForGameOver();
    }

    tintRed(player) {
        player.setTint(0xff0000);
        this.time.delayedCall(500, () => {
            player.clearTint();
        });
    }

    checkForGameOver() {
        if (this.vidaActual <= 0) {
            this.victoriasMagnus++;
            this.resetRound();
        } else if (this.vidaActualMagnus <= 0) {
            this.victoriasAlaric++;
            this.resetRound();
        }

        if (this.victoriasAlaric >= this.rondasGanadas || this.victoriasMagnus >= this.rondasGanadas) {
            this.scene.start('GameOver');
        }
    }

    resetRound() {
        this.puedeMoverse = false; // Desactivar el movimiento
        this.player1.setVelocity(0);
        this.player2.setVelocity(0);
    
        this.vidaActual = 10;
        this.vidaActualMagnus = 10;
        this.updateVida();
        this.updateVidaMagnus();
        
        this.player1.setPosition(this.posicionAlaric.x, this.posicionAlaric.y);
        this.player2.setPosition(this.posicionMagnus.x, this.posicionMagnus.y);
    
        this.textoVictorias.setText(`Alaric: ${this.victoriasAlaric} - Magnus: ${this.victoriasMagnus}`);
        
        this.puedeDisparar = false;
        this.contador = 3;
        
        // Destruir texto del contador si existe
        if (this.textoContador) {
            this.textoContador.destroy();
        }
    
        this.mostrarContador();
        this.iniciarContador();
    }

    updateVida() {
        const frameIndex = 10 - this.vidaActual;
        this.vidaAlaric.setFrame(frameIndex);
    }

    updateVidaMagnus() {
        const frameIndex = 10 - this.vidaActualMagnus;
        this.vidaMagnus.setFrame(frameIndex);
    }

    mostrarContador() {
        this.textoContador = this.add.text(500, 400, this.contador, {
            fontSize: '128px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    }

    iniciarContador() {
        this.enContador = true;
        const contadorInterval = setInterval(() => {
            if (this.contador > 0) {
                this.textoContador.setText(this.contador);
                this.contador--;
            } else {
                clearInterval(contadorInterval);
                this.textoContador.destroy();
                this.enContador = false;
                this.puedeDisparar = true;
                this.puedeMoverse = true; // Reactivar el movimiento
            }
        }, 1000);
    }

    generarPocion(x, y) {
        const probabilidad = Math.random();
        if (probabilidad < 1) { // 50% de probabilidad de generar una poción
            const pocion = this.physics.add.sprite(x, y, 'pocion'); // Asegúrate de tener una imagen de poción cargada
            pocion.setInteractive();
            pocion.on('pointerdown', () => {
                this.recibirCuracion();
                pocion.destroy();
            });
        }
    }

    recibirCuracion() {
        this.vidaActual = Math.min(this.vidaActual + 1, 10); // Curar 1 punto de vida, max 10
        this.updateVida();
        console.log("Alaric ha recibido curación! Vida actual:", this.vidaActual);
    }
}
