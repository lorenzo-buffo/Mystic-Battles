import { Scene } from 'phaser';
export class Game extends Scene {
    constructor() {
        super('Game');
    }
    initVariables() {
        this.vidaActual = 10;
        this.vidaActualMagnus = 10;
        this.contador = 3;
        this.textoContador = null;
        this.enContador = true;
        this.puedeDisparar = true;
        this.puedeMoverse = true; 
        this.cooldownAlaric = false;  
        this.cooldownMagnus = false; 
        this.posicionAlaric = { x: 100, y: 900 };
        this.posicionMagnus = { x: 900, y: 100 };
        this.puedeUsarAtaqueElectricoAlaric = false;
        this.puedeUsarAtaqueElectricoMagnus = false;
    }

    create() {
        this.initVariables();
        this.add.image(512, 384, 'mapa');
        // crear a Alaric
        this.player1 = this.physics.add.sprite(this.posicionAlaric.x, this.posicionAlaric.y, "alaric_walk");
        this.player1.setScale(1);
        this.player1.setBounce(0);
        this.player1.setCollideWorldBounds(true);
        this.player1.play('move');

        // crear a Magnus
        this.player2 = this.physics.add.sprite(this.posicionMagnus.x, this.posicionMagnus.y, "magnus_walk");
        this.player2.setScale(1);
        this.player2.setBounce(0);
        this.player2.setCollideWorldBounds(true);
        this.player2.play('move_magnus');

        // movimiento de Alaric
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Movimiento de Magnus
        this.cursors2 = this.input.keyboard.createCursorKeys();

        // colisión entre ambos personajes
        this.physics.add.collider(this.player1, this.player2);

        // generar cajas
        this.cajas = this.physics.add.group();
        this.crearCajas();
        this.physics.add.collider(this.player1, this.cajas);
        this.physics.add.collider(this.player2, this.cajas);

        // ataques de Alaric (barra espaciadora) y Magnus (Shift)
        this.input.keyboard.on('keydown-SPACE', this.intentaAtaqueAlaric, this);
        this.input.keyboard.on('keydown-SHIFT', this.intentaAtaqueMagnus, this);

        // crea un grupo de ataques
        this.ataques = this.physics.add.group();

        // crea barra de vida para Alaric
        this.vidaAlaric = this.add.sprite(100, 50, 'barraVida', 0);
        this.textoAlaric = this.add.text(100, 30, 'ALARIC', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',      
            strokeThickness: 5,
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);

        // crea barra de vida para Magnus
        this.vidaMagnus = this.add.sprite(900, 50, 'barraVida', 0);
        this.textoMagnus = this.add.text(900, 30, 'MAGNUS', {
            fontSize: '20px',
            fill: '#ffffff',
            stroke: '#000000',      
            strokeThickness: 5,
            align: 'center',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);

        this.pociones = this.physics.add.group();
        this.rayos = this.physics.add.group();
        this.mostrarContador();
        this.iniciarContador(); 

        // Imagen "exit" para salir a la escena MainMenu
        let exitButton = this.add.image(510, 50, 'exit')
            .setScale(0.1)
            .setInteractive({ useHandCursor: true });
        exitButton.on('pointerover', () => {
            exitButton.setScale(0.08); 
        });
        exitButton.on('pointerout', () => {
            exitButton.setScale(0.09);  
        });
        exitButton.on('pointerdown', () => {
            this.scene.start('MainMenu');  
        });
        //sonidos 
        this.sonidoDisparoNormal = this.sound.add('disparoNormal');
        this.sonidoDisparoElectrico = this.sound.add('disparoElectrico');
        this.sonidoEmergencia = this.sound.add('emergenciasound');
        this.sonidoNumeros = this.sound.add('numeros');
        this.musicaGame = this.sound.add('musicaGame', { loop: true });
        this.musicaGame.play();
    }

    update() {
        if (!this.puedeMoverse || this.enContador) {
            return; 
        }
        // controla el movimiento de Alaric según la tecla presionada
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

        // lo mismo para Magnus
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

        // interacciones y colisiones de los ataques
        this.ataques.children.iterate((ataque) => {
            if (ataque) {
                this.physics.add.collider(ataque, this.cajas, (ataque, caja) => {
                    this.reproducirExplosion(ataque.x, ataque.y); // Llamar a la función de explosión
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

                // Maneja el daño que reciben los personajes al colisionar con un ataque
                if (this.physics.overlap(ataque, this.player2) && ataque.getData('owner') === 'Alaric') {
                    this.reproducirExplosion(ataque.x, ataque.y);
                    ataque.destroy();
                    this.recibeDañoMagnus();
                } else if (this.physics.overlap(ataque, this.player1) && ataque.getData('owner') === 'Magnus') {
                    this.reproducirExplosion(ataque.x, ataque.y);
                    ataque.destroy();
                    this.recibeDaño();
                }
            }
        });
    }

    iniciarCooldownAlaric() {
        this.cooldownAlaric = true;
        this.time.delayedCall(350, () => {
            this.cooldownAlaric = false;
        });
    } 
    iniciarCooldownMagnus() {
        this.cooldownMagnus = true;
        this.time.delayedCall(350, () => {
            this.cooldownMagnus = false;
        });
    }
    
    realizarAtaque(player, tipoAtaque) {
        let ataque;
        if (tipoAtaque === 'normal') {
            ataque = this.ataques.create(player.x, player.y, 'ataque');
            ataque.play('ataqueAnim');
            this.sonidoDisparoNormal.play(); // Usa la instancia del sonido
            ataque.setData('owner', player === this.player1 ? 'Alaric' : 'Magnus');
        } else if (tipoAtaque === 'electrico') {
            ataque = this.ataques.create(player.x, player.y, 'ataqueElectrico');
            ataque.play('ataqueElectricoAnim');
            ataque.setData('owner', player === this.player1 ? 'Alaric' : 'Magnus');
            ataque.setData('tipo', 'electrico');
            this.sonidoDisparoElectrico.play(); // Usa la instancia del sonido
        }
        // Calcula la dirección del ataque
        const direction = new Phaser.Math.Vector2(
            (player === this.player1 ? this.player2.x : this.player1.x) - player.x,
            (player === this.player1 ? this.player2.y : this.player1.y) - player.y
        );
        direction.normalize();
        ataque.setVelocity(
            direction.x * (tipoAtaque === 'electrico' ? 1000 : 500), 
            direction.y * (tipoAtaque === 'electrico' ? 1000 : 500)
        );
        ataque.setScale(1);
    
        // Destruir el ataque después de 5 segundos
        this.time.delayedCall(5000, () => {
            if (ataque && ataque.active) {
                ataque.destroy();
            }
        });
    }
    
intentaAtaqueAlaric() {
    if (this.puedeDisparar && !this.cooldownAlaric) {
        this.realizarAtaque(this.player1, this.puedeUsarAtaqueElectricoAlaric ? 'electrico' : 'normal');
        this.iniciarCooldownAlaric();
    }
}

intentaAtaqueMagnus() {
    if (this.puedeDisparar && !this.cooldownMagnus) {
        this.realizarAtaque(this.player2, this.puedeUsarAtaqueElectricoMagnus ? 'electrico' : 'normal');
        this.iniciarCooldownMagnus();
    }
}

reproducirExplosion(x, y) {
    const explosion = this.add.sprite(x, y, 'explosion'); // Crea el sprite de explosión
    explosion.play('explosionAnim'); // Reproduce la animación de explosión
    // Reproduce el sonido de explosión
    const explosionSound = this.sound.add('explosionSound');
    explosionSound.play();
    // Destruye la explosión después de que termine la animación
    explosion.on('animationcomplete', () => {
        explosion.destroy(); // Destruye el sprite de explosión
    });
}

recibeDaño() {
    this.vidaActual--; // Disminuye la vida actual de Alaric
    this.updateVida(); // Actualiza la barra de vida
    this.tintRed(this.player1); // Efecto visual de daño
    this.checkForGameOver(); // Verifica si el juego ha terminado
}

recibeDañoMagnus() {
    this.vidaActualMagnus--; // Disminuye la vida actual de Magnus
    this.updateVidaMagnus(); // Actualiza la barra de vida
    this.tintRed(this.player2); // Efecto visual de daño
    this.checkForGameOver(); // Verifica si el juego ha terminado
}

tintRed(player) {
    player.setTint(0xff0000); // Aplica tinte rojo al personaje
    this.time.delayedCall(500, () => {
        player.clearTint(); // Limpia el tinte después de 500 ms
    });
}

crearCajas() {
    const tamañosCajas = [100, 100, 100, 100]; // Tamaños de las cajas
    const posicionesEsquinas = [ // Posiciones donde se crearán las cajas
        { x: 150, y: 200 },
        { x: 850, y: 200 },
        { x: 150, y: 600 },
        { x: 850, y: 600 }
    ];
    posicionesEsquinas.forEach((pos) => {
        const caja = this.cajas.create(pos.x, pos.y, 'caja_spritesheet'); // Crea la caja
        caja.setImmovable(true); // La caja no se puede mover
        caja.setScale(1.5); // Escala de la caja
        caja.collisiones = 0; // Inicializa el contador de colisiones
        caja.setFrame(0); // Inicializa la caja en el primer frame
    });
    const cajaCentro = this.cajas.create(500, 400, 'caja_spritesheet'); // Crea la caja central
    cajaCentro.setImmovable(true); // La caja no se puede mover
    cajaCentro.setScale(2); // Escala de la caja central
    cajaCentro.collisiones = 0; // Inicializa el contador de colisiones
    cajaCentro.setFrame(0); // Inicializa la caja en el primer frame
}

updateVida() {
    const frameIndex = 10 - this.vidaActual; // Calcula el índice del frame
    this.vidaAlaric.setFrame(frameIndex); // Actualiza el frame de la barra de vida
}

updateVidaMagnus() {
    const frameIndex = 10 - this.vidaActualMagnus; // Calcula el índice del frame
    this.vidaMagnus.setFrame(frameIndex); // Actualiza el frame de la barra de vida
}

checkForGameOver() {
    if (this.vidaActual <= 0 || this.vidaActualMagnus <= 0) {
        // Si Alaric gana
        if (this.vidaActualMagnus <= 0) {
            this.scene.start('GameOver', { winner: 'Alaric' }); // Pasa el ganador
        } 
        // Si Magnus gana
        else if (this.vidaActual <= 0) {
            this.scene.start('GameOver', { winner: 'Magnus' }); // Pasa el ganador
        }
    }
}

mostrarContador() {
    this.textoContador = this.add.text(500, 400, '3', {
        fontSize: '128px',
        fill: '#ffffff',
        fontFamily: 'Pixelify Sans'
    }).setOrigin(0.5, 0.5);
}

iniciarContador() {
    this.enContador = true;
    this.contador = 3;
    this.puedeDisparar = false; // Desactiva el disparo
    const contadorInterval = setInterval(() => {
        if (this.contador > 0) {
            this.textoContador.setText(this.contador);
            this.contador--;
            this.sonidoNumeros.play();
        } else {
            clearInterval(contadorInterval);
            this.textoContador.destroy();
            this.enContador = false; // Desactiva el estado de contador
            this.puedeDisparar = true; // Permite disparar
            this.puedeMoverse = true; // Reactiva el movimiento
        }
    }, 1000);
}

// Genera una poción con probabilidades ajustadas
generarPocion(x, y) {
    const probabilidad = Math.random(); // Genera un número aleatorio

    // 50% de probabilidad de generar una poción de curación
    if (probabilidad < 0.5) {
        const pocion = this.physics.add.sprite(x, y, 'pocion'); // Crea la poción
        pocion.setInteractive(); // Habilita la interacción
        pocion.setScale(1); // Establece la escala
        pocion.play('pocion_appear'); // Reproduce la animación de aparición
        // Colisión con Alaric
        this.physics.add.overlap(this.player1, pocion, () => {
            this.recibirCuracion(this.player1); // Aplica curación a Alaric
            pocion.destroy(); // Destruye la poción
        });
        // Colisión con Magnus
        this.physics.add.overlap(this.player2, pocion, () => {
            this.recibirCuracion(this.player2); // Aplica curación a Magnus
            pocion.destroy(); // Destruye la poción
        });
    } else if (probabilidad < 0.7) {  // 20% de probabilidad de generar una poción de ataque rara
        const pocionAtaque = this.physics.add.sprite(x, y, 'pocion_ataque'); // Crea la poción de ataque
        pocionAtaque.setInteractive(); // Habilita la interacción
        pocionAtaque.setScale(1); // Establece la escala
        pocionAtaque.play('pocion_ataque_appear'); // Reproduce la animación de aparición
        // Colisión con Alaric
        this.physics.add.overlap(this.player1, pocionAtaque, () => {
            this.generarRayos(this.player1); // Genera rayos para Alaric
            pocionAtaque.destroy(); // Destruye la poción de ataque
        });
        // Colisión con Magnus
        this.physics.add.overlap(this.player2, pocionAtaque, () => {
            this.generarRayos(this.player2); // Genera rayos para Magnus
            pocionAtaque.destroy(); // Destruye la poción de ataque
        });
    } else { // 30% de probabilidad de generar la poción eléctrica
        const pocionElectrica = this.physics.add.sprite(x, y, 'pocionElectrica'); // Crea la poción eléctrica
        pocionElectrica.setInteractive(); // Habilita la interacción
        pocionElectrica.setScale(1); // Establece la escala
        pocionElectrica.play('pocionElectrica_appear'); // Reproduce la animación de aparición
        // Colisión con Alaric
        this.physics.add.overlap(this.player1, pocionElectrica, () => {
            this.aplicarEfectoElectrico(this.player1); 
            pocionElectrica.destroy(); 
        });
        // Colisión con Magnus
        this.physics.add.overlap(this.player2, pocionElectrica, () => {
            this.aplicarEfectoElectrico(this.player2); 
            pocionElectrica.destroy(); 
        });
    }
}

aplicarEfectoElectrico(player) {
    if (player === this.player1) {
        this.puedeUsarAtaqueElectricoAlaric = true; // Permite el ataque eléctrico para Alaric
        const electricSound = this.sound.add('electricSound'); 
        electricSound.play(); 
        this.time.delayedCall(10000, () => {
            this.puedeUsarAtaqueElectricoAlaric = false; // Desactiva el ataque eléctrico después de 10 segundos
        });
    } else if (player === this.player2) {
        this.puedeUsarAtaqueElectricoMagnus = true; // Permite el ataque eléctrico para Magnus
        const electricSound = this.sound.add('electricSound'); 
        electricSound.play(); 
        this.time.delayedCall(10000, () => {
            this.puedeUsarAtaqueElectricoMagnus = false; // Desactiva el ataque eléctrico después de 10 segundos
        });
    }
}

recibirCuracion(player) {
    if (player === this.player1) {
        this.vidaActual = Math.min(this.vidaActual + 3, 10); // Cura 3 puntos de vida, max 10
        const curaSound = this.sound.add('vidaSound');
    curaSound.play();
        this.updateVida(); // Actualiza la barra de vida
    } else if (player === this.player2) {
        this.vidaActualMagnus = Math.min(this.vidaActualMagnus + 3, 10); // Cura 3 puntos de vida, max 10
        const curaSound = this.sound.add('vidaSound');
    curaSound.play();
        this.updateVidaMagnus(); // Actualiza la barra de vida
    }
}

generarRayos(player) {
    const numRayos = 4; // Número de rayos a generar
    const espaciado = 200; // Espaciado entre rayos
    const posiciones = new Set(); // Conjunto para almacenar posiciones únicas
    const offset = 20; // Desplazamiento lateral
    const maxAltura = this.cameras.main.height - 50 - espaciado * (numRayos - 1); // Altura máxima para los rayos

    for (let i = 0; i < numRayos; i++) {
        let altura;
        do {
            altura = Phaser.Math.Between(50, maxAltura); // Genera una altura aleatoria
        } while (posiciones.has(altura)); // Asegura que la altura sea única

        posiciones.add(altura); // Agrega la altura al conjunto
        altura += i * espaciado; // Ajusta la altura según el índice
        const lado = Math.random() < 0.5 ? 'izquierda' : 'derecha'; // Decide el lado del rayo
        const posicionX = lado === 'izquierda' ? offset : this.cameras.main.width - offset; // Establece la posición X

        // Reproduce el sonido de emergencia
        this.sonidoEmergencia.play();

        const señal = this.add.sprite(posicionX, altura, 'Emergencia').setOrigin(0.5, 0.5).setScale(0.1); // Crea la señal

        // Crear el rayo justo después de que la señal desaparezca
        this.time.delayedCall(1000, () => {
            señal.destroy(); // Destruye la señal

            // Reproduce el sonido del rayo aquí
            const rayoSound = this.sound.add('rayoSound');
            rayoSound.play();

            const rayo = this.add.sprite(lado === 'izquierda' ? -50 : this.cameras.main.width + 50, altura, 'Rayo').setOrigin(0.5, 0.5); // Crea el rayo
            this.rayos.add(rayo); // Agrega el rayo al grupo

            const targetX = lado === 'izquierda' ? this.cameras.main.width + 50 : -50; // Establece la posición objetivo
            this.tweens.add({
                targets: rayo, // Objetivo del tween
                x: targetX, // Posición X final
                duration: 1000, // Duración del tween
                ease: 'Linear', // Tipo de easing
                onComplete: () => rayo.destroy() // Destruye el rayo al completar
            });
        });
    }

    // Maneja la colisión de rayos con Alaric
    this.physics.add.overlap(this.player1, this.rayos, (player, rayo) => {
        const impactoSound = this.sound.add('rayoColision'); 
        impactoSound.play(); 
        this.vidaActual -= 4; 
        this.updateVida(); 
        this.tintRed(this.player1); 
        rayo.destroy(); 
        this.checkForGameOver(); 
    });

    // Maneja la colisión de rayos con Magnus
    this.physics.add.overlap(this.player2, this.rayos, (player, rayo) => {
        const impactoSound = this.sound.add('rayoColision'); 
        impactoSound.play(); 
        this.vidaActualMagnus -= 4; 
        this.updateVidaMagnus(); 
        this.tintRed(this.player2); 
        rayo.destroy(); 
        this.checkForGameOver(); 
    });
}
}