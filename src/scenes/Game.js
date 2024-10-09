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
    this.cooldown = false; // Inicializar cooldown
    this.puedeUsarAtaqueElectricoAlaric = false;
    this.puedeUsarAtaqueElectricoMagnus = false;
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
    this.rayos = this.physics.add.group();

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

            //Maneja el daño que reciben los personajes al colisionar con un ataque
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

// Intenta realizar un ataque con Alaric
intentaAtaqueAlaric() {
    if (this.puedeDisparar && !this.cooldown) { // Verifica si se puede disparar y si no hay cooldown
        if (this.puedeUsarAtaqueElectricoAlaric) {
            this.ataqueElectricoAlaric(); // Realiza ataque eléctrico
        } else {
            this.ataqueAlaric(); // Realiza ataque normal
        }
        this.iniciarCooldown(); // Inicia el cooldown
    }
}

// Intenta realizar un ataque con Magnus
intentaAtaqueMagnus() {
    if (this.puedeDisparar && !this.cooldown) { // Verifica si se puede disparar y si no hay cooldown
        if (this.puedeUsarAtaqueElectricoMagnus) {
            this.ataqueElectricoMagnus(); // Realiza ataque eléctrico
        } else {
            this.ataqueMagnus(); // Realiza ataque normal
        }
        this.iniciarCooldown(); // Inicia el cooldown
    }
}

// Inicia el cooldown
iniciarCooldown() {
    this.cooldown = true; // Activa el estado de cooldown
    this.time.delayedCall(350, () => {
        this.cooldown = false; // Reinicia el cooldown después de 350 ms
    });
}

// Lanza el ataque de Alaric hacia la posición de Magnus con velocidad determinada
ataqueAlaric() {
    const ataque1 = this.ataques.create(this.player1.x, this.player1.y, 'ataque'); // Crea el ataque
    ataque1.play('ataqueAnim'); // Reproduce la animación del ataque
    ataque1.setData('owner', 'Alaric'); // Establece el propietario del ataque

    // Calcula la dirección del ataque
    const direction = new Phaser.Math.Vector2(this.player2.x - this.player1.x, this.player2.y - this.player1.y);
    direction.normalize(); // Normaliza la dirección
    ataque1.setVelocity(direction.x * 500, direction.y * 500); // Establece la velocidad
    ataque1.setScale(1); // Establece la escala del ataque
    console.log("Alaric ataca!"); // Mensaje en consola
}

// Lanza el ataque de Magnus hacia la posición de Alaric con velocidad determinada
ataqueMagnus() {
    const ataque = this.ataques.create(this.player2.x, this.player2.y, 'ataque'); // Crea el ataque
    ataque.play('ataqueAnim'); // Reproduce la animación del ataque
    ataque.setData('owner', 'Magnus'); // Establece el propietario del ataque

    // Calcula la dirección del ataque
    const direction = new Phaser.Math.Vector2(this.player1.x - this.player2.x, this.player1.y - this.player2.y);
    direction.normalize(); // Normaliza la dirección
    ataque.setVelocity(direction.x * 500, direction.y * 500); // Establece la velocidad
    ataque.setScale(1); // Establece la escala del ataque
    console.log("Magnus ataca!"); // Mensaje en consola
}

// Lanza el ataque eléctrico de Alaric
ataqueElectricoAlaric() {
    const ataqueElectrico = this.ataques.create(this.player1.x, this.player1.y, 'ataqueElectrico'); // Crea el ataque eléctrico
    ataqueElectrico.play('ataqueElectricoAnim'); // Reproduce la animación del ataque eléctrico
    ataqueElectrico.setData('owner', 'Alaric'); // Establece el propietario del ataque
    ataqueElectrico.setData('tipo', 'electrico'); // Añade el tipo

    // Calcula la dirección del ataque
    const direction = new Phaser.Math.Vector2(this.player2.x - this.player1.x, this.player2.y - this.player1.y);
    direction.normalize(); // Normaliza la dirección
    ataqueElectrico.setVelocity(direction.x * 800, direction.y * 800); // Establece la velocidad
    ataqueElectrico.setScale(1); // Establece la escala del ataque eléctrico
    console.log("Alaric ataca eléctricamente!"); // Mensaje en consola
}

// Lanza el ataque eléctrico de Magnus
ataqueElectricoMagnus() {
    const ataqueElectrico = this.ataques.create(this.player2.x, this.player2.y, 'ataqueElectrico'); // Crea el ataque eléctrico
    ataqueElectrico.play('ataqueElectricoAnim'); // Reproduce la animación del ataque eléctrico
    ataqueElectrico.setData('owner', 'Magnus'); // Establece el propietario del ataque
    ataqueElectrico.setData('tipo', 'electrico'); // Añade el tipo

    // Calcula la dirección del ataque
    const direction = new Phaser.Math.Vector2(this.player1.x - this.player2.x, this.player1.y - this.player2.y);
    direction.normalize(); // Normaliza la dirección
    ataqueElectrico.setVelocity(direction.x * 800, direction.y * 800); // Establece la velocidad
    ataqueElectrico.setScale(1); // Establece la escala del ataque eléctrico
    console.log("Magnus ataca eléctricamente!"); // Mensaje en consola
}

// Reproduce la animación de explosión en la posición especificada
reproducirExplosion(x, y) {
    const explosion = this.add.sprite(x, y, 'explosion'); // Crea el sprite de explosión
    explosion.play('explosionAnim'); // Reproduce la animación de explosión

    // Destruye la explosión después de que termine la animación
    explosion.on('animationcomplete', () => {
        explosion.destroy(); // Destruye el sprite de explosión
    });
}

// Maneja el daño que recibe Magnus
recibeDaño() {
    this.vidaActual--; // Disminuye la vida actual de Alaric
    this.updateVida(); // Actualiza la barra de vida
    console.log("Alaric recibe daño! Vida actual:", this.vidaActual); // Mensaje en consola
    this.tintRed(this.player1); // Efecto visual de daño
    this.checkForGameOver(); // Verifica si el juego ha terminado
}

// Maneja el daño que recibe Alaric
recibeDañoMagnus() {
    this.vidaActualMagnus--; // Disminuye la vida actual de Magnus
    this.updateVidaMagnus(); // Actualiza la barra de vida
    console.log("Magnus recibe daño! Vida actual:", this.vidaActualMagnus); // Mensaje en consola
    this.tintRed(this.player2); // Efecto visual de daño
    this.checkForGameOver(); // Verifica si el juego ha terminado
}

// Tiñe a los personajes de rojo para simular daño
tintRed(player) {
    player.setTint(0xff0000); // Aplica tinte rojo al personaje
    this.time.delayedCall(500, () => {
        player.clearTint(); // Limpia el tinte después de 500 ms
    });
}

// Comprueba si alguno de los jugadores ha perdido toda su vida y si alguno ha ganado suficientes rondas para terminar el juego
checkForGameOver() {
    let ganador = null; // Inicializa el ganador

    // Verifica la vida de Alaric
    if (this.vidaActual <= 0) {
        this.victoriasMagnus++; // Incrementa victorias de Magnus
        this.resetRound(); // Resetea la ronda
    } else if (this.vidaActualMagnus <= 0) {
        this.victoriasAlaric++; // Incrementa victorias de Alaric
        this.resetRound(); // Resetea la ronda
    }

    // Verifica si se ha alcanzado el número de rondas ganadas
    if (this.victoriasAlaric >= this.rondasGanadas || this.victoriasMagnus >= this.rondasGanadas) {
        ganador = this.victoriasAlaric > this.victoriasMagnus ? 'Alaric' : 'Magnus'; // Determina el ganador
        this.scene.start('GameOver', { ganador, victoriasAlaric: this.victoriasAlaric, victoriasMagnus: this.victoriasMagnus }); // Inicia la escena de Game Over
    }
}

// Crea cajas en posiciones establecidas
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

// Reinicia la ronda junto con todas las variables que se han cambiado en el transcurso del gameplay
resetRound() {
    this.puedeMoverse = false; // Desactiva el movimiento
    this.player1.setVelocity(0); // Detiene el movimiento de Alaric
    this.player2.setVelocity(0); // Detiene el movimiento de Magnus

    this.vidaActual = 10; // Restablece la vida de Alaric
    this.vidaActualMagnus = 10; // Restablece la vida de Magnus
    this.updateVida(); // Actualiza la barra de vida de Alaric
    this.updateVidaMagnus(); // Actualiza la barra de vida de Magnus

    // Restablece las posiciones de los jugadores
    this.player1.setPosition(this.posicionAlaric.x, this.posicionAlaric.y);
    this.player2.setPosition(this.posicionMagnus.x, this.posicionMagnus.y);

    this.textoVictorias.setText(`Alaric: ${this.victoriasAlaric} - Magnus: ${this.victoriasMagnus}`); // Actualiza el texto de victorias

    this.puedeDisparar = false; // Desactiva el disparo
    this.contador = 3; // Reinicia el contador

    // Reinicia las cajas al inicio de la ronda
    this.cajas.clear(true, true); // Elimina las cajas existentes
    this.crearCajas(); // Crea las nuevas cajas

    // Elimina las pociones existentes
    this.pociones.clear(true, true); // Elimina las pociones

    // Destruye texto del contador si existe
    if (this.textoContador) {
        this.textoContador.destroy(); // Destruye el texto del contador
    }

    this.mostrarContador(); // Muestra el contador
    this.iniciarContador(); // Inicia el contador
}

// Actualiza la barra de vida de Alaric según su vida actual
updateVida() {
    const frameIndex = 10 - this.vidaActual; // Calcula el índice del frame
    this.vidaAlaric.setFrame(frameIndex); // Actualiza el frame de la barra de vida
}

// Actualiza la barra de vida de Magnus según su vida actual
updateVidaMagnus() {
    const frameIndex = 10 - this.vidaActualMagnus; // Calcula el índice del frame
    this.vidaMagnus.setFrame(frameIndex); // Actualiza el frame de la barra de vida
}

// Muestra un contador para iniciar la partida
mostrarContador() {
    this.textoContador = this.add.text(500, 400, this.contador, {
        fontSize: '128px',
        fill: '#ffffff',
        fontFamily: 'Pixelify Sans'
    }).setOrigin(0.5, 0.5); // Centro del texto
}

// Se inicia el contador
iniciarContador() {
    this.enContador = true; // Activa el estado de contador
    const contadorInterval = setInterval(() => {
        if (this.contador > 0) {
            this.textoContador.setText(this.contador); // Actualiza el texto del contador
            this.contador--; // Decrementa el contador
        } else {
            clearInterval(contadorInterval); // Limpia el intervalo
            this.textoContador.destroy(); // Destruye el texto del contador
            this.enContador = false; // Desactiva el estado de contador
            this.puedeDisparar = true; // Permite disparar
            this.puedeMoverse = true; // Reactiva el movimiento
        }
    }, 1000); // Cada segundo
}

// Genera una poción con una probabilidad del 50% que cura a los personajes
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
    } else if (probabilidad < 0.75) {  // 25% de probabilidad de generar una poción de ataque rara
        const pocionAtaque = this.physics.add.sprite(x, y, 'pocion_ataque'); // Crea la poción de ataque
        pocionAtaque.setInteractive(); // Habilita la interacción
        pocionAtaque.setScale(1.2); // Establece la escala
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
    } else { // 25% de probabilidad de generar la poción eléctrica
        const pocionElectrica = this.physics.add.image(x, y, 'pocionElectrica'); // Crea la poción eléctrica
        pocionElectrica.setInteractive(); // Habilita la interacción
        pocionElectrica.setScale(1); // Establece la escala

        // Colisión con Alaric
        this.physics.add.overlap(this.player1, pocionElectrica, () => {
            this.aplicarEfectoElectrico(this.player1); // Aplica el efecto eléctrico a Alaric
            pocionElectrica.destroy(); // Destruye la poción eléctrica
        });

        // Colisión con Magnus
        this.physics.add.overlap(this.player2, pocionElectrica, () => {
            this.aplicarEfectoElectrico(this.player2); // Aplica el efecto eléctrico a Magnus
            pocionElectrica.destroy(); // Destruye la poción eléctrica
        });
    }
}

// Aplica el efecto eléctrico al jugador
aplicarEfectoElectrico(player) {
    if (player === this.player1) {
        this.puedeUsarAtaqueElectricoAlaric = true; // Permite el ataque eléctrico para Alaric
        console.log("Alaric ha recogido una poción eléctrica!"); // Mensaje en consola
        this.time.delayedCall(10000, () => {
            this.puedeUsarAtaqueElectricoAlaric = false; // Desactiva el ataque eléctrico después de 10 segundos
        });
    } else if (player === this.player2) {
        this.puedeUsarAtaqueElectricoMagnus = true; // Permite el ataque eléctrico para Magnus
        console.log("Magnus ha recogido una poción eléctrica!"); // Mensaje en consola
        this.time.delayedCall(10000, () => {
            this.puedeUsarAtaqueElectricoMagnus = false; // Desactiva el ataque eléctrico después de 10 segundos
        });
    }
}

// Los personajes se curan 3 puntos de vida al colisionar con la poción
recibirCuracion(player) {
    if (player === this.player1) {
        this.vidaActual = Math.min(this.vidaActual + 3, 10); // Cura 3 puntos de vida, max 10
        this.updateVida(); // Actualiza la barra de vida
        console.log("Alaric ha recibido curación! Vida actual:", this.vidaActual); // Mensaje en consola
    } else if (player === this.player2) {
        this.vidaActualMagnus = Math.min(this.vidaActualMagnus + 3, 10); // Cura 3 puntos de vida, max 10
        this.updateVidaMagnus(); // Actualiza la barra de vida
        console.log("Magnus ha recibido curación! Vida actual:", this.vidaActualMagnus); // Mensaje en consola
    }
}

// Genera rayos en posiciones aleatorias
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

        const señal = this.add.sprite(posicionX, altura, 'Emergencia').setOrigin(0.5, 0.5).setScale(0.1); // Crea la señal

        // Crear el rayo justo después de que la señal desaparezca
        this.time.delayedCall(1000, () => {
            señal.destroy(); // Destruye la señal

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
        this.vidaActual -= 4; // Cambia el daño a 4 solo para los rayos
        this.updateVida(); // Actualiza la barra de vida de Alaric
        console.log("Alaric recibe daño por rayo! Vida actual:", this.vidaActual); // Mensaje en consola
        this.tintRed(this.player1); // Efecto visual
        rayo.destroy(); // Destruye el rayo después de colisionar
        this.checkForGameOver(); // Verifica si el juego ha terminado
    });
    
    // Maneja la colisión de rayos con Magnus
    this.physics.add.overlap(this.player2, this.rayos, (player, rayo) => {
        this.vidaActualMagnus -= 4; // Cambia el daño a 4 solo para los rayos
        this.updateVidaMagnus(); // Actualiza la barra de vida de Magnus
        console.log("Magnus recibe daño por rayo! Vida actual:", this.vidaActualMagnus); // Mensaje en consola
        this.tintRed(this.player2); // Efecto visual
        rayo.destroy(); // Destruye el rayo después de colisionar
        this.checkForGameOver(); // Verifica si el juego ha terminado
    });
}
}