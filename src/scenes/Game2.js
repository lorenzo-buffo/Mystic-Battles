import { Scene } from 'phaser';

export class Game2 extends Scene {
    constructor() {
        super('Game2');
        this.currentLevel = 0;
        this.recipes = [
            {
                sequence: ['W', 'A', 'S', 'D'],
                text: 'Recuerda bien la receta 1!',
                imageKey: 'ingles'
            },
            {
                sequence: ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT'],
                text: 'Recuerda bien la receta 2!',
                imageKey: 'Español'
            },
            // Agrega los demás niveles aquí...
        ];
        this.timeLimit = 10; // Tiempo límite en segundos
        this.timerEvent = null;
        this.userInput = [];
        this.timerText = null; // Para mostrar el temporizador
        this.remainingTime = 0; // Tiempo restante
    }

    create() {
        this.restartGame(); // Reinicia el juego al crear la escena
    }

    restartGame() {
        this.currentLevel = 0; // Reinicia el nivel
        this.showRecipe(); // Muestra la receta del primer nivel
    }

    showRecipe() {
        const { text, imageKey } = this.recipes[this.currentLevel];

        const recetaImage = this.add.image(500, 300, imageKey).setScale(0.5).setAlpha(0);
        const texto = this.add.text(500, 180, text, {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center',
            fontFamily: 'Pixelify Sans'
        }).setOrigin(0.5).setAlpha(0);

        if (this.timerText) {
            this.timerText.destroy(); // Elimina el temporizador anterior
        }

        this.timerText = this.add.text(500, 50, '', {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center',
            fontFamily: 'Pixelify Sans'
        }).setOrigin(0.5).setAlpha(0); // Comienza invisible

        // Animación de entrada
        this.tweens.add({
            targets: [recetaImage, texto],
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(5000, () => {
                    this.tweens.add({
                        targets: [recetaImage, texto],
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            recetaImage.destroy();
                            texto.destroy();
                            this.startTimer(); // Inicia el temporizador aquí
                        }
                    });
                });
            }
        });
    }

    startTimer() {
        this.userInput = []; // Reinicia la entrada del usuario
        this.remainingTime = this.timeLimit; // Tiempo restante

        this.timerText.setText(`Tiempo: ${this.remainingTime}`); // Muestra el tiempo inicial
        this.timerText.setAlpha(1); // Hace visible el temporizador

        this.timerEvent = this.time.addEvent({
            delay: 1000, // Cada segundo
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Configura los eventos de entrada
        this.input.keyboard.on('keydown', this.handleInput, this);
    }

    updateTimer() {
        this.remainingTime--;
        this.timerText.setText(`Tiempo: ${this.remainingTime}`);

        if (this.remainingTime <= 0) {
            this.timerEvent.remove(); // Detiene el temporizador
            this.onTimeUp(); // Maneja el tiempo agotado
        }
    }

    handleInput(event) {
        const key = event.code; // Usa event.code para obtener el código de la tecla
        const currentSequence = this.recipes[this.currentLevel].sequence;

        // Debugging logs
        console.log(`Tecla presionada: ${key}`);
        console.log(`Entrada del usuario: ${this.userInput}`);
        console.log(`Secuencia actual: ${currentSequence}`);

        if (key === `KeyW` && currentSequence[this.userInput.length] === 'W') {
            this.userInput.push('W');
        } else if (key === `KeyA` && currentSequence[this.userInput.length] === 'A') {
            this.userInput.push('A');
        } else if (key === `KeyS` && currentSequence[this.userInput.length] === 'S') {
            this.userInput.push('S');
        } else if (key === `KeyD` && currentSequence[this.userInput.length] === 'D') {
            this.userInput.push('D');
        } else if (this.currentLevel === 1) { // Para el nivel 2
            if (key === 'ArrowUp' && currentSequence[this.userInput.length] === 'ARROWUP') {
                this.userInput.push('ARROWUP');
            } else if (key === 'ArrowDown' && currentSequence[this.userInput.length] === 'ARROWDOWN') {
                this.userInput.push('ARROWDOWN');
            } else if (key === 'ArrowLeft' && currentSequence[this.userInput.length] === 'ARROWLEFT') {
                this.userInput.push('ARROWLEFT');
            } else if (key === 'ArrowRight' && currentSequence[this.userInput.length] === 'ARROWRIGHT') {
                this.userInput.push('ARROWRIGHT');
            }
        }

        console.log(`Entrada correcta: ${this.userInput}`);

        // Verifica si se completó la receta
        if (this.userInput.length === currentSequence.length) {
            this.onRecipeComplete();
        } else if (this.userInput.length > currentSequence.length) {
            console.log('Tecla incorrecta. Intenta de nuevo.');
            this.userInput = []; // Reinicia la entrada
        }
    }

    onRecipeComplete() {
        this.timerEvent.remove();
        this.timerText.destroy(); // Elimina el temporizador actual

        this.currentLevel++;

        if (this.currentLevel < this.recipes.length) {
            this.showRecipe();
        } else {
            console.log('¡Felicidades, completaste todos los niveles!');
            this.scene.start('MainMenu'); // Cambia a la escena MainMenu
        }
    }

    onTimeUp() {
        this.input.keyboard.off('keydown', this.handleInput, this);
        console.log('Tiempo agotado. Fin del nivel.');
        this.scene.start('MainMenu'); // Cambia a la escena MainMenu
    }
}