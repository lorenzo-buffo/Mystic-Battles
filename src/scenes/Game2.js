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
        this.completo = false; // Indica si el jugador completó todos los hechizos
    }
    create() {
        this.regenerarNiveles();
        this.clicsRestantes = 5; // Clics disponibles
        this.enEspera = false; // Indica si está en espera
        this.add.image(512, 384, 'mapacoop');

        let exitButton = this.add.image(950, 50, 'exit')
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
            stroke: '#000000',      
            strokeThickness: 5,
            fontFamily: 'Pixelify Sans'
        }).setVisible(false);

        this.vidaJugadores = 0; // Vida inicial de los jugadores
        this.vidaJugadoresSprite = this.add.sprite(500, 150, 'barraVida', this.vidaJugadores).setScale(1.5);

        this.textoBarraJugador = this.add.text(500, 400, '', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Pixelify Sans',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.ataquesDisponibles = this.add.text(850, 500, getPhrase(`Ataques disponibles: ${this.clicsRestantes}/5`), {
            fontSize: '28px',
            fill: '#ffffff',
            stroke: '#000000',      
            strokeThickness: 5,
            fontFamily: 'Pixelify Sans'
        }).setOrigin(0.5, 0.5);

        // Añadir eventos de entrada
        this.input.keyboard.on('keydown', this.capturarLetra, this);
        
        const alaricCoop = this.physics.add.sprite(120, 650, 'Alariccoop').setOrigin(0.5, 0.5);
        alaricCoop.play('alaricCoopAnim');
        const magnusCoop = this.physics.add.sprite(900, 650, 'Magnuscoop').setOrigin(0.5, 0.5);
        magnusCoop.play('magnusCoopAnim');
        const caldero = this.physics.add.sprite(500, 660, 'caldero').setOrigin(0.5, 0.5).setScale(1.3);
        caldero.play('calderoAnim');

        this.murcielagosGroup = this.physics.add.group();

        this.time.addEvent({
            delay: 800,
            callback: this.crearMurcielago,
            callbackScope: this,
            loop: true
        });
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
            stroke: '#000000',      
            strokeThickness: 5,
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

            this.vidaJugadores = 0; // Reiniciar vida al tiempo agotado
            this.vidaJugadoresSprite.setFrame(this.vidaJugadores);

            this.nivelActual = 0;
            this.regenerarNiveles();
            this.scene.start('GameOver2', { completo: this.completo }); // Iniciar GameOver2
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

                if (this.nivelActual >= this.niveles) {
                    this.completo = true;
                    this.scene.start('GameOver2', { completo: this.completo });
                } else {
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

        this.murcielagosGroup.children.iterate((murcielago) => {
            if (murcielago) {
                if (murcielago.x < 0 || murcielago.x > 800 || murcielago.y > 600) {
                    murcielago.destroy();
                }
            }
        });
    }

    aumentarVida() {
        this.vidaJugadores++;
        this.vidaJugadoresSprite.setFrame(this.vidaJugadores);

        if (this.vidaJugadores >= 10) {
            this.scene.start('GameOver2', { completo: this.completo }); // Iniciar GameOver2
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
    crearMurcielago() {
        let murcielago = this.murcielagosGroup.create(Math.random() * 800, -50, 'murcielago');
        murcielago.setScale(1.2);
        murcielago.setInteractive();
    
        murcielago.on('pointerdown', () => {
            if (this.clicsRestantes > 0 && !this.enEspera) {
                this.eliminarMurcielago(murcielago);
                this.clicsRestantes--;
                this.ataquesDisponibles.setText(`Ataques disponibles: ${this.clicsRestantes}/5`);
    
                if (this.clicsRestantes === 0) {
                    this.enEspera = true;
                    this.time.delayedCall(3000, () => {
                        this.clicsRestantes = 5;
                        this.ataquesDisponibles.setText(`Ataques disponibles: ${this.clicsRestantes}/5`);
                        this.enEspera = false;
                    });
                }
            }
        });
    
        let destinoX = Phaser.Math.Between(100, 900);
        let destinoY = 400;
        this.tweens.add({
            targets: murcielago,
            x: destinoX,
            y: destinoY,
            duration: 500,
            onComplete: () => {
                this.revolotear(murcielago, destinoX, destinoY);
            }
        });
    }
    
    revolotear(murcielago, centerX, centerY) {
        this.tweens.add({
            targets: murcielago,
            x: centerX + Phaser.Math.Between(-50, 50),
            y: centerY + Phaser.Math.Between(-50, 50),
            duration: 2000,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                // Limitar movimiento dentro de un área
                murcielago.x = Phaser.Math.Clamp(murcielago.x, centerX - 200, centerX + 200);
                murcielago.y = Phaser.Math.Clamp(murcielago.y, centerY - 200, centerY + 200);
            }
        });
    }    

    eliminarMurcielago(murcielago) {
        // Crear un sprite de explosión en la posición del murciélago
        const explosion = this.add.sprite(murcielago.x, murcielago.y, 'explosion');
        explosion.play('explosionAnim');
        explosion.setScale(2);
        // Eliminar el murciélago después de un tiempo
        explosion.on('animationcomplete', () => {
            explosion.destroy(); // Eliminar la explosión después de que termine la animación
        });
        murcielago.destroy(); // Eliminar el murcielago
    }
}