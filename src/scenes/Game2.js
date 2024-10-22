import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class Game2 extends Scene {
    constructor() {
        super('Game2');
        this.arrayNivel = [];
        this.arrayJugador = [];
        this.niveles = 10; // Total de niveles
        this.nivelActual = 0; // Nivel actual
        this.mostrarTexto = false; // Controlar cuándo mostrar el texto
        this.textoNivel = null; // Para almacenar el objeto de texto
        this.mensajeIncorrecto = null; // Para almacenar el mensaje de hechizo incorrecto
        this.puedeJugar = false; // Controlar si el jugador puede interactuar
        this.tiempoRestante = 15; // Tiempo en segundos
        this.textoTemporizador = null; // Para mostrar el temporizador
        this.temporizador = null; // Evento del temporizador
        this.textoBarraJugador = null; // Para mostrar las teclas presionadas
        this.vidaJugadores = 0; // Vida inicial de los jugadores
    }

    create() {
        this.regenerarNiveles(); // Generar las combinaciones de letras al iniciar el juego

        const cuadro = this.add.image(500, 400, "cuadro").setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: cuadro,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1 },
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.mostrarTexto = true;
                this.mostrarArrayNivel(this.nivelActual);
                this.time.delayedCall(5000, this.ocultarArrayNivel, [], this);
            }
        });

        this.textoTemporizador = this.add.text(425, 50, getPhrase(`Tiempo: ${this.tiempoRestante}`), {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans'
        }).setVisible(false);

        this.vidaJugadoresSprite = this.add.sprite(500, 150, 'barraVida', this.vidaJugadores).setScale(1.5);

        // Inicializar el texto para mostrar las teclas presionadas
        this.textoBarraJugador = this.add.text(500, 400, '', {
            fontSize: '32px',
            fill: '#00ff00', // Color verde para las teclas presionadas
            fontFamily: 'Pixelify Sans', // Asegurarse de que la fuente coincida
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown', this.capturarLetra, this);
        //Animacion de alaric
        const alaricCoop =  this.physics.add.sprite(120, 650, 'Alariccoop').setOrigin(0.5, 0.5);
        alaricCoop.play('alaricCoopAnim');
        //Animacion de magnus
        const magnusCoop =  this.physics.add.sprite(900, 650, 'Magnuscoop').setOrigin(0.5, 0.5);
        magnusCoop.play('magnusCoopAnim');
        //crear caldero
        const caldero = this.physics.add.sprite(500, 660, 'caldero').setOrigin(0.5, 0.5).setScale(1.3);
        caldero.play('calderoAnim');
    }

    regenerarNiveles() {
        this.arrayNivel = [];
        for (let nivel = 1; nivel <= this.niveles; nivel++) {
            const cantidadTeclas = 5 + (nivel - 1);
            this.arrayNivel.push(this.generarArrayAleatorio(cantidadTeclas));
        }
        console.log(this.arrayNivel);
    }

    mostrarArrayNivel(nivel) {
        this.textoNivel = this.add.text(300, 380, getPhrase(`Nivel ${nivel + 1}: ${this.arrayNivel[nivel].join(', ')}`), {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans'
        }).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: this.textoNivel,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1 },
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(4000, this.ocultarArrayNivel, [], this);
            }
        });
    }

    ocultarArrayNivel() {
        if (this.textoNivel) {
            this.tweens.add({
                targets: this.textoNivel,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.5 },
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    this.textoNivel.destroy();
                    this.mostrarTexto = false;
                    this.puedeJugar = true;

                    this.iniciarTemporizador();

                    if (this.mensajeIncorrecto) {
                        this.mensajeIncorrecto.destroy();
                    }
                }
            });
        }
    }

    iniciarTemporizador() {
        this.tiempoRestante = 20;
        this.textoTemporizador.setText(getPhrase(`Tiempo: ${this.tiempoRestante}`));
        this.textoTemporizador.setVisible(true);
        if (this.temporizador) {
            this.temporizador.remove();
        }
        this.temporizador = this.time.addEvent({
            delay: 1000,
            callback: this.reducirTiempo,
            callbackScope: this,
            loop: true
        });
    }

    reducirTiempo() {
        this.tiempoRestante--;

        this.textoTemporizador.setText(getPhrase(`Tiempo: ${this.tiempoRestante}`));

        if (this.tiempoRestante <= 0) {
            this.temporizador.remove();
            console.log('¡Tiempo agotado!');

            // Reinicia la vida del jugador
            this.vidaJugadores = 0; 
            this.vidaJugadoresSprite.setFrame(this.vidaJugadores); // Reinicia la barra de vida

            this.nivelActual = 0;
            this.regenerarNiveles();
            this.scene.start('MainMenu');
        }
    }

    capturarLetra(event) {
        if (this.mostrarTexto) {
            return;
        }
        if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
            this.arrayJugador.push(event.key.toUpperCase());
            this.textoBarraJugador.setText(this.arrayJugador.join(' '));
        }
    }

    update() {
        const cantidadTeclas = this.arrayNivel[this.nivelActual]?.length;

        if (this.puedeJugar && this.arrayJugador.length === cantidadTeclas) {
            const nivelCorrecto = this.arrayNivel[this.nivelActual].every((letra, index) => letra === this.arrayJugador[index]);

            if (nivelCorrecto) {
                this.nivelActual++;
                this.arrayJugador = [];
                this.textoBarraJugador.setText('');
                this.textoTemporizador.setVisible(false);

                if (this.nivelActual < this.niveles) {
                    this.mostrarTexto = true;
                    this.mostrarArrayNivel(this.nivelActual);
                    this.puedeJugar = false;
                }
            } else {
                this.mostrarMensajeIncorrecto();
                this.arrayJugador = [];
                this.aumentarVida();
                this.textoBarraJugador.setText('');
            }
        }
    }

    aumentarVida() {
        this.vidaJugadores++;
        this.vidaJugadoresSprite.setFrame(this.vidaJugadores);

        if (this.vidaJugadores >= 10) {
            this.scene.start('MainMenu');
        }
    }

    mostrarMensajeIncorrecto() {
        this.mensajeIncorrecto = this.add.text(300, 380, getPhrase('Hechizo incorrecto!'), {
            fontSize: '32px',
            fill: '#ff0000',
            fontFamily: 'Pixelify Sans'
        }).setAlpha(0);

        this.tweens.add({
            targets: this.mensajeIncorrecto,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1 },
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: this.mensajeIncorrecto,
                        alpha: { from: 1, to: 0 },
                        scale: { from: 1, to: 0.5 },
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            this.mensajeIncorrecto.destroy();
                        }
                    });
                });
            }
        });
    }

    generarArrayAleatorio(cantidad) {
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const array = [];

        for (let i = 0; i < cantidad; i++) {
            const letraAleatoria = letras.charAt(Math.floor(Math.random() * letras.length));
            array.push(letraAleatoria);
        }

        return array;
    }
}
