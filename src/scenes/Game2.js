import { Scene } from 'phaser';

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
    }

    create() {
        this.regenerarNiveles(); // Generar las combinaciones de letras al iniciar el juego

        // Inicializar el texto del temporizador
        this.textoTemporizador = this.add.text(100, 50, `Tiempo: ${this.tiempoRestante}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setVisible(false); // Inicialmente oculto

        // Inicializar el texto para mostrar las teclas presionadas
        this.textoBarraJugador = this.add.text(100, 150, '', {
            fontSize: '32px',
            fill: '#00ff00' // Color verde para las teclas presionadas
        });

        // Mostrar el primer array
        this.mostrarTexto = true;
        this.mostrarArrayNivel(this.nivelActual);
        this.time.delayedCall(5000, this.ocultarArrayNivel, [], this);
        this.input.keyboard.on('keydown', this.capturarLetra, this);
    }

    regenerarNiveles() {
        this.arrayNivel = []; // Limpiar el array de niveles
        for (let nivel = 1; nivel <= this.niveles; nivel++) {
            const cantidadTeclas = 5 + (nivel - 1);
            this.arrayNivel.push(this.generarArrayAleatorio(cantidadTeclas));
        }
        console.log(this.arrayNivel); // Muestra el nuevo array en la consola
    }

    mostrarArrayNivel(nivel) {
        // Crear un texto para mostrar el array correspondiente al nivel
        this.textoNivel = this.add.text(100, 100, `Nivel ${nivel + 1}: ${this.arrayNivel[nivel].join(', ')}`, {
            fontSize: '32px',
            fill: '#ffffff'
        });
    }

    ocultarArrayNivel() {
        // Eliminar el texto de la pantalla
        if (this.textoNivel) {
            this.textoNivel.destroy();
        }
        this.mostrarTexto = false; // Cambiar el estado para no mostrar más texto
        this.puedeJugar = true; // Permitir la interacción nuevamente

        // Iniciar el temporizador
        this.iniciarTemporizador();

        // Eliminar mensaje incorrecto si existe
        if (this.mensajeIncorrecto) {
            this.mensajeIncorrecto.destroy();
        }
    }

    iniciarTemporizador() {
        this.tiempoRestante = 15; // Reiniciar el temporizador a 15
        this.textoTemporizador.setText(`Tiempo: ${this.tiempoRestante}`); // Actualizar el texto
        this.textoTemporizador.setVisible(true); // Mostrar el temporizador
        if (this.temporizador) {
            this.temporizador.remove(); // Detener cualquier temporizador existente
        }
        this.temporizador = this.time.addEvent({
            delay: 1000, // 1 segundo
            callback: this.reducirTiempo,
            callbackScope: this,
            loop: true
        });
    }

    reducirTiempo() {
        this.tiempoRestante--;

        // Actualizar el texto del temporizador
        this.textoTemporizador.setText(`Tiempo: ${this.tiempoRestante}`);

        // Si el tiempo se agota
        if (this.tiempoRestante <= 0) {
            this.temporizador.remove(); // Detener el temporizador
            console.log('¡Tiempo agotado!');
            this.nivelActual = 0; // Reiniciar al nivel 0
            this.regenerarNiveles(); // Generar nuevas combinaciones
            this.scene.start('MainMenu'); // Cambiar a la escena MainMenu
        }
    }

    capturarLetra(event) {
        if (this.mostrarTexto) {
            return; // Ignorar entradas mientras se muestra el texto
        }

        if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) { // Solo letras
            this.arrayJugador.push(event.key.toUpperCase()); // Agregar la letra al array
            console.log(this.arrayJugador); // Muestra el array del jugador en la consola
            
            // Actualizar el texto de la barra con las teclas presionadas
            this.textoBarraJugador.setText(this.arrayJugador.join(' ')); // Mostrar letras separadas por espacio
        }
    }

    update() {
        // Verificar si la cantidad de elementos en arrayJugador es igual a la cantidad de teclas
        const cantidadTeclas = this.arrayNivel[this.nivelActual]?.length;

        if (this.puedeJugar && this.arrayJugador.length === cantidadTeclas) {
            // Comparar arrayNivel y arrayJugador
            const nivelCorrecto = this.arrayNivel[this.nivelActual].every((letra, index) => letra === this.arrayJugador[index]);

            if (nivelCorrecto) {
                console.log(`Nivel ${this.nivelActual + 1} completado!`);
                this.nivelActual++;
                this.arrayJugador = []; // Reiniciar arrayJugador para el siguiente nivel

                // Limpiar la barra de letras presionadas al pasar al siguiente nivel
                this.textoBarraJugador.setText(''); // Limpiar la barra de letras

                // Ocultar el temporizador al completar el nivel
                this.textoTemporizador.setVisible(false);

                // Verificar si hay más niveles
                if (this.nivelActual < this.niveles) {
                    this.mostrarTexto = true;
                    this.mostrarArrayNivel(this.nivelActual);
                    this.puedeJugar = false; // Desactivar entrada mientras se muestra el texto
                    this.time.delayedCall(5000, this.ocultarArrayNivel, [], this);
                } else {
                    console.log('¡Todos los niveles completados!');
                }
            } else {
                // Mostrar mensaje de hechizo incorrecto
                this.mostrarMensajeIncorrecto();
                this.arrayJugador = []; // Reiniciar arrayJugador si no es correcto
                // Limpiar la barra de letras presionadas si el hechizo es incorrecto
                this.textoBarraJugador.setText(''); // Limpiar la barra de letras
            }
        }
    }

    mostrarMensajeIncorrecto() {
        // Crear el mensaje de hechizo incorrecto
        this.mensajeIncorrecto = this.add.text(100, 200, 'Hechizo incorrecto!', {
            fontSize: '32px',
            fill: '#ff0000'
        });

        // Ocultar el mensaje después de 2 segundos
        this.time.delayedCall(2000, () => {
            if (this.mensajeIncorrecto) {
                this.mensajeIncorrecto.destroy();
            }
        });

        // Aquí NO reinicias el nivel ni el arrayJugador
        // Solo informas al jugador y permites que intente nuevamente
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
