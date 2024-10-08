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

        //crear a alaric
        this.player1 = this.physics.add.sprite(this.posicionAlaric.x, this.posicionAlaric.y, "alaric_walk");
        this.player1.setScale(1);
        this.player1.setBounce(0);
        this.player1.setCollideWorldBounds(true);
        this.player1.play('move');

        //crear a magnus
        this.player2 = this.physics.add.sprite(this.posicionMagnus.x, this.posicionMagnus.y, "magnus_walk");
        this.player2.setScale(1);
        this.player2.setBounce(0);
        this.player2.setCollideWorldBounds(true);
        this.player2.play('move_magnus');

        //movimiento de alaric
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        //Movimiento de Magnus
        this.cursors2 = this.input.keyboard.createCursorKeys();

        //colision entre ambos personajes
        this.physics.add.collider(this.player1, this.player2);

        //generar cajas
        this.cajas = this.physics.add.group();
        this.crearCajas();
        this.physics.add.collider(this.player1, this.cajas);
        this.physics.add.collider(this.player2, this.cajas);

        //ataques de alaric(barra espoaciadora) y magnus(click)
        this.input.keyboard.on('keydown-SPACE', this.intentaAtaqueAlaric, this);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.intentaAtaqueMagnus();
            }
        }, this);

        //crea un grupo de ataques
        this.ataques = this.physics.add.group();

        //crea barra de vida para alaric
        this.vidaAlaric = this.add.sprite(100, 50, 'barraVida', 0);
        this.textoAlaric = this.add.text(100, 30, 'ALARIC', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);

        //crea barra de vida para magnus
        this.vidaMagnus = this.add.sprite(900, 50, 'barraVida', 0);
        this.textoMagnus = this.add.text(900, 30, 'MAGNUS', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);

        //crea un texto para determinarn como va la partida
        this.textoVictorias = this.add.text(500, 20, 'Alaric: 0 - Magnus: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);

        this.pociones = this.physics.add.group();

        //reinicia la ronda
        this.resetRound();
    }

    update() {
        if (!this.puedeMoverse || this.enContador) {
            return; // No permitir movimiento
        }
        
        //controla el movimiento de alaric segun la tecla presionada
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

        //lo mismo para magnus
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

        //interacciones y colisiones de los ataques
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

                //Maneja el daño que reciben los personajes al colisionar con un ataque
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

    //Intenta realizar un ataque con Alaric si puede disparar
    intentaAtaqueAlaric() {
        if (this.puedeDisparar) {
            this.ataqueAlaric();
        }
    }

    //lo mismo para magnus
    intentaAtaqueMagnus() {
        if (this.puedeDisparar) {
            this.ataqueMagnus();
        }
    }

    //lanza el ataque de alaric hacia la posicion de magnus con una velocidad determinada
    ataqueAlaric() {
        const ataque1 = this.ataques.create(this.player1.x, this.player1.y, 'ataque');
        ataque1.setData('owner', 'Alaric');
        const direction = new Phaser.Math.Vector2(this.player2.x - this.player1.x, this.player2.y - this.player1.y);
        direction.normalize();
        ataque1.setVelocity(direction.x * 500, direction.y * 500);
        ataque1.setScale(0.1);
        console.log("Alaric ataca!");
    }

    //lanza el ataque de magnus hacia la posicion de alaric con una velocidad determinada
    ataqueMagnus() {
        const ataque = this.ataques.create(this.player2.x, this.player2.y, 'ataque');
        ataque.setData('owner', 'Magnus');
        const direction = new Phaser.Math.Vector2(this.player1.x - this.player2.x, this.player1.y - this.player2.y);
        direction.normalize();
        ataque.setVelocity(direction.x * 500, direction.y * 500);
        ataque.setScale(0.1);
        console.log("Magnus ataca!");
    }

    //maneja el daño que recibe magnus
    recibeDaño() {
        this.vidaActual--;
        this.updateVida();
        console.log("Alaric recibe daño! Vida actual:", this.vidaActual);
        this.tintRed(this.player1);
        this.checkForGameOver();
    }

    //Maneja el daño que recibe alaric
    recibeDañoMagnus() {
        this.vidaActualMagnus--;
        this.updateVidaMagnus();
        console.log("Magnus recibe daño! Vida actual:", this.vidaActualMagnus);
        this.tintRed(this.player2);
        this.checkForGameOver();
    }

    //tiñe a los personajes de rojo para simular daño
    tintRed(player) {
        player.setTint(0xff0000);
        this.time.delayedCall(500, () => {
            player.clearTint();
        });
    }

    //Comprueba si alguno de los jugadores ha perdido toda su vida y si alguno ha ganado suficientes rondas para terminar el juego.
    checkForGameOver() {
        let ganador = null;

    if (this.vidaActual <= 0) {
        this.victoriasMagnus++;
        this.resetRound();
    } else if (this.vidaActualMagnus <= 0) {
        this.victoriasAlaric++;
        this.resetRound();
    }
    
    if (this.victoriasAlaric >= this.rondasGanadas || this.victoriasMagnus >= this.rondasGanadas) {
        ganador = this.victoriasAlaric > this.victoriasMagnus ? 'Alaric' : 'Magnus';
        this.scene.start('GameOver', { ganador, victoriasAlaric: this.victoriasAlaric, victoriasMagnus: this.victoriasMagnus });
    }
}

    //crea cajas en pociciones establecidas
    crearCajas() {
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
            caja.setScale(1.5);
            caja.collisiones = 0;
            caja.setFrame(0);  // Inicializar la caja en el primer frame
        });
        
        const cajaCentro = this.cajas.create(500, 400, 'caja_spritesheet');
        cajaCentro.setImmovable(true);
        cajaCentro.setScale(2);
        cajaCentro.collisiones = 0;
        cajaCentro.setFrame(0);  // Inicializar la caja en el primer frame
    }

    //reinicia la ronda junto con todas las variables que se han cambiado en el transcurso del gameplay
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
        // Reiniciar las cajas al inicio de la ronda
        this.cajas.clear(true, true); // Elimina las cajas existentes
        this.crearCajas(); // Crea las nuevas cajas

        // Elimina las pociones existentes
        this.pociones.clear(true, true); // Elimina las pociones
        
        // Destruir texto del contador si existe
        if (this.textoContador) {
            this.textoContador.destroy();
        }
    
        this.mostrarContador();
        this.iniciarContador();
    }

    //Actualiza la barra de vida de Alaric según su vida actual
    updateVida() {
        const frameIndex = 10 - this.vidaActual;
        this.vidaAlaric.setFrame(frameIndex);
    }

    //Actualiza la barra de vida de magnus según su vida actual.
    updateVidaMagnus() {
        const frameIndex = 10 - this.vidaActualMagnus;
        this.vidaMagnus.setFrame(frameIndex);
    }

    //muestra un contador para iniciar la partida
    mostrarContador() {
        this.textoContador = this.add.text(500, 400, this.contador, {
            fontSize: '128px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    }

    //se inicia el contador
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

    //Genera una poción con una probabilidad del 50% que cura a los personajes
    generarPocion(x, y) {
        const probabilidad = Math.random();
    
        if (probabilidad < 0.5) { // 50% de probabilidad de generar una poción de curación
            const pocion = this.physics.add.sprite(x, y, 'pocion'); 
            pocion.setInteractive();
            pocion.setScale(1);
            pocion.play('pocion_appear'); // Reproduce la animación
    
            // Agregar colisión con Alaric
            this.physics.add.overlap(this.player1, pocion, () => {
                this.recibirCuracion(this.player1);
                pocion.destroy();
            });
    
            // Agregar colisión con Magnus
            this.physics.add.overlap(this.player2, pocion, () => {
                this.recibirCuracion(this.player2);
                pocion.destroy();
            });
    
        } else if (probabilidad < 1) {  // 50% de probabilidad de generar una poción de ataque rara
            const pocionAtaque = this.physics.add.sprite(x, y, 'pocion_ataque');
            pocionAtaque.setInteractive();
            pocionAtaque.setScale(1);
            pocionAtaque.play('pocion_ataque_appear'); // Reproduce la animación
    
            // Colisión con Alaric
            this.physics.add.overlap(this.player1, pocionAtaque, () => {
                this.generarRayos(this.player1);
                pocionAtaque.destroy();
            });
    
            // Colisión con Magnus
            this.physics.add.overlap(this.player2, pocionAtaque, () => {
                this.generarRayos(this.player2);
                pocionAtaque.destroy();
            });
        }
    }
    

    //los personajes se curan 3 puntos de vida al colisionar con la pocion.
    recibirCuracion(player) {
        if (player === this.player1) {
            this.vidaActual = Math.min(this.vidaActual + 3, 10); // Curar 3 puntos de vida, max 10
            this.updateVida();
            console.log("Alaric ha recibido curación! Vida actual:", this.vidaActual);
        } else if (player === this.player2) {
            this.vidaActualMagnus = Math.min(this.vidaActualMagnus + 3, 10); // Curar 3 puntos de vida, max 10
            this.updateVidaMagnus();
            console.log("Magnus ha recibido curación! Vida actual:", this.vidaActualMagnus);
        }
    }

    generarRayos(player) {
        const numRayos = 5; // Número de rayos a generar
        const espaciado = 100; // Espaciado vertical entre los rayos
        const rayos = [];
        const posiciones = []; // Para almacenar posiciones usadas
        const offset = 20; // Ajusta este valor para el margen deseado
    
        // Calcular el rango de alturas permitido
        const maxAltura = this.cameras.main.height - 50 - espaciado * (numRayos - 1);
    
        for (let i = 0; i < numRayos; i++) {
            let altura;
    
            // Elegir una altura única para cada rayo
            do {
                altura = Phaser.Math.Between(50, maxAltura); // Altura aleatoria
            } while (posiciones.includes(altura)); // Asegurarse de que no se repita
    
            // Agregar la posición usada
            posiciones.push(altura); // Agregar altura usada
    
            // Ajustar la altura del rayo para el espaciado
            altura += i * espaciado; // Espaciado vertical
    
            const lado = Math.random() < 0.5 ? 'izquierda' : 'derecha';
    
            // Ajustar la posición de la señal para que esté cerca del borde de la pantalla
            const posicionX = lado === 'izquierda' 
                ? offset // Unos pocos píxeles dentro del borde izquierdo
                : this.cameras.main.width - offset; // Unos pocos píxeles dentro del borde derecho
    
            // Mostrar señal de emergencia
            const señal = this.add.sprite(
                posicionX,
                altura,
                'Emergencia' // Asegúrate de tener esta imagen cargada
            ).setOrigin(0.5, 0.5);
            señal.setScale(0.1); // Ajustar el tamaño de la señal si es necesario
    
            // Destruir la señal después de 1 segundo
            this.time.delayedCall(1000, () => {
                señal.destroy();
            });
    
            // Generar el rayo después de un breve retraso
            this.time.delayedCall(1000, () => {
                const rayo = this.add.sprite(
                    lado === 'izquierda' ? -50 : this.cameras.main.width + 50,
                    altura,
                    'Rayo'
                ).setOrigin(0.5, 0.5);
    
                // Animar el rayo para que se mueva hacia el centro
                const targetX = lado === 'izquierda' ? this.cameras.main.width + 50 : -50;
                this.tweens.add({
                    targets: rayo,
                    x: targetX,
                    duration: 1000,
                    ease: 'Linear',
                    onComplete: () => {
                        rayo.destroy(); // Destruir el rayo después de que se mueve fuera de la pantalla
                    }
                });
    
                rayos.push(rayo); // Guardar el rayo en un array si necesitas manipularlo después
            });
        }
    } 
}