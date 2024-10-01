import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    initVariables() {
        this.vidaActual = 10; // Vida inicial de Alaric
        this.vidaActualMagnus = 10; // Vida inicial de Magnus
        this.victoriasAlaric = 0; // Contador de victorias de Alaric
        this.victoriasMagnus = 0; // Contador de victorias de Magnus
        this.rondasGanadas = 2; // Número de rondas necesarias para ganar
        this.contador = 3; // Inicializa el contador en 3
        this.textoContador = null; // Para mostrar el contador en pantalla
        this.enContador = true; // Indica si está en el contador
        this.puedeDisparar = true; // Nueva variable para controlar disparos

        // Posiciones iniciales
        this.posicionAlaric = { x: 100, y: 900 };
        this.posicionMagnus = { x: 900, y: 100 };
    }

    create() {
        this.initVariables(); // Inicializa las variables al crear la escena

        this.cameras.main.setBackgroundColor(0x006400);
        
        // Crear a Alaric
        this.player1 = this.physics.add.sprite(this.posicionAlaric.x, this.posicionAlaric.y, "alaric_walk");
        this.player1.setScale(1);
        this.player1.setBounce(0);
        this.player1.setCollideWorldBounds(true);
        this.player1.play('move');

        // Crear a Magnus
        this.player2 = this.physics.add.sprite(this.posicionMagnus.x, this.posicionMagnus.y, "magnus_walk");
        this.player2.setScale(1);
        this.player2.setBounce(0);
        this.player2.setCollideWorldBounds(true);
        this.player2.play('move_magnus');

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

        // Crear grupo de cajas
        this.cajas = this.physics.add.group();

        // Crear las cajas en las esquinas
        const tamañosCajas = [100, 100, 100, 100]; // Tamaños de las cajas en las esquinas
        const posicionesEsquinas = [
            { x: 150, y: 200 }, // Esquina superior izquierda
            { x: 850, y: 200 }, // Esquina superior derecha
            { x: 150, y: 600 }, // Esquina inferior izquierda
            { x: 850, y: 600 }  // Esquina inferior derecha
        ];

        // Crear cajas en las esquinas
        posicionesEsquinas.forEach((pos, index) => {
            const caja = this.cajas.create(pos.x, pos.y, 'Caja'); // Asegúrate de que 'caja_texture' esté cargado
            caja.setSize(tamañosCajas[index], tamañosCajas[index]).setImmovable(true);
            caja.setScale(0.4);
            caja.collisiones = 0; // Contador de colisiones para cajas pequeñas
        });

        // Crear la caja más grande en el centro
        const cajaCentro = this.cajas.create(500, 400, 'Caja'); // Asegúrate de que 'caja_texture' esté cargado
        cajaCentro.setSize(250, 250).setImmovable(true);
        cajaCentro.setScale(0.8);
        cajaCentro.collisiones = 0; // Contador de colisiones para la caja grande

        // Colisiones entre jugadores y cajas
        this.physics.add.collider(this.player1, this.cajas);
        this.physics.add.collider(this.player2, this.cajas);

        // Escuchar ataques
        this.input.keyboard.on('keydown-SPACE', this.intentaAtaqueAlaric, this);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.intentaAtaqueMagnus();
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
        this.textoVictorias = this.add.text(500, 20, 'Alaric: 0 - Magnus: 0', {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5, 0.5);

        // Inicializar vida y victorias
        this.resetRound();
    }

    update() {
        if (this.enContador) {
            return; // Si está en el contador, no permitir movimiento
        }
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

        // Verificar colisiones entre ataques y cajas
        this.ataques.children.iterate((ataque) => {
            if (ataque) {
                this.physics.add.collider(ataque, this.cajas, (ataque, caja) => {
                    ataque.destroy(); // Destruir el ataque al colisionar con una caja
                    caja.collisiones++; // Incrementar el contador de colisiones

                    // Verificar si la caja debe ser destruida
                    if (caja.collisiones >= 5 && caja.scale === 0.4) { // Para las cajas pequeñas
                        caja.destroy(); // Destruir la caja pequeña
                    } else if (caja.collisiones >= 10 && caja.scale === 0.8) { // Para la caja grande
                        caja.destroy(); // Destruir la caja grande
                    }
                });

                // Verificar colisiones con jugadores
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
        
        // Restablecer posiciones
        this.player1.setPosition(this.posicionAlaric.x, this.posicionAlaric.y);
        this.player2.setPosition(this.posicionMagnus.x, this.posicionMagnus.y);
    
        // Actualiza el texto de victorias
        this.textoVictorias.setText(`Alaric: ${this.victoriasAlaric} - Magnus: ${this.victoriasMagnus}`);
        
        // Iniciar el contador
        this.puedeDisparar = false; // Desactiva el disparo al reiniciar la ronda
        this.contador = 3;
        this.mostrarContador();
        this.iniciarContador();
    }

    updateVida() {
        const frameIndex = 10 - this.vidaActual; // Asumiendo que hay 11 frames
        this.vidaAlaric.setFrame(frameIndex);
    }

    updateVidaMagnus() {
        const frameIndex = 10 - this.vidaActualMagnus; // Asumiendo que hay 11 frames
        this.vidaMagnus.setFrame(frameIndex);
    }

    mostrarContador() {
        this.textoContador = this.add.text(500, 400, this.contador, {
            fontSize: '128px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    }

    iniciarContador() {
        this.enContador = true; // Activar el estado de contador
        const contadorInterval = setInterval(() => {
            if (this.contador > 0) {
                this.textoContador.setText(this.contador);
                this.contador--;
            } else {
                clearInterval(contadorInterval);
                this.textoContador.destroy(); // Eliminar el texto del contador
                this.enContador = false; // Desactivar el estado de contador
                this.puedeDisparar = true; // Reactiva el disparo al terminar el contador
                this.jugar(); // Iniciar el juego
            }
        }, 1000); // Disminuye el contador cada segundo
    }
}
