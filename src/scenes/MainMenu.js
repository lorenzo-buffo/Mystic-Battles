import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }
    init(data){
        this.language = data.language;
    }

    create() {
        // Crear los elementos de la escena
        const background = this.add.image(512, 384, 'background');
        const logo = this.add.image(512, 300, 'logo');
        const title = this.add.text(512, 460, getPhrase('Hora de elegir un modo de juego.'), {
            fontFamily: 'Pixelify Sans', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Variable para almacenar la selección del modo de juego
        let selectedMode = '';

        // AGREGAR BOTON MODO VS
        const vsButton = this.add.text(200, 600, getPhrase("Modo VS"), {
            fontFamily: 'Pixelify Sans', fontSize: 36, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);
        vsButton.setInteractive({ cursor: 'pointer' });
        vsButton.on('pointerover', () => {
            vsButton.setScale(0.8);
        });
        vsButton.on('pointerout', () => {
            vsButton.setScale(1);
        });
        vsButton.on('pointerdown', () => {
            selectedMode = 'VS';
            showPopup(getPhrase('Has seleccionado el Modo VS'));
        });

        // AGREGAR BOTON MODO COOP
        const coopButton = this.add.text(750, 600, getPhrase("Modo Cooperativo"), {
            fontFamily: 'Pixelify Sans', fontSize: 36, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);
        coopButton.setInteractive({ cursor: 'pointer' });
        coopButton.on('pointerover', () => {
            coopButton.setScale(0.8);
        });
        coopButton.on('pointerout', () => {
            coopButton.setScale(1);
        });
        coopButton.on('pointerdown', () => {
            selectedMode = 'Coop';
            showPopup(getPhrase('Has seleccionado el Modo Cooperativo'));
        });

        // CREAR UN POP-UP
        const popup = this.add.container(512, 384).setVisible(false);

        // Cambiar el tamaño y color del fondo del pop-up
        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x8B4511, 1); // Cambia el color aquí
        popupBackground.fillRect(-300, -250, 600, 500); // Cambia el tamaño aquí

        const popupText = this.add.text(0, -150, '', {
            fontFamily: 'Pixelify Sans', fontSize: 32, color: '#ffffff' // Ajusta el tamaño del texto si es necesario
        }).setOrigin(0.5);

        // Botón para comenzar
        const startButton = this.add.text(0, 100, getPhrase('Comenzar'), {
            fontFamily: 'Pixelify Sans', fontSize: 36, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);
        startButton.setInteractive({ cursor: 'pointer' });
        startButton.on('pointerover', () => {
            startButton.setScale(0.8);
        });
        startButton.on('pointerout', () => {
            startButton.setScale(1);
        });
        startButton.on('pointerdown', () => {
            if (selectedMode === 'VS') {
                this.scene.start('Game'); // Escena para el modo VS
            } else if (selectedMode === 'Coop') {
                this.scene.start('Game2'); // Escena para el modo Cooperativo
            }
        });

        // Botón para cerrar el pop-up
        const closeButton = this.add.image(250, -210, 'exit').setOrigin(0.5);
        closeButton.setScale(0.1);
        closeButton.setInteractive({ cursor: 'pointer' });

        // Añadir eventos para achicar el botón al pasar el cursor
        closeButton.on('pointerover', () => {
            closeButton.setScale(0.08);
        });
        closeButton.on('pointerout', () => {
            closeButton.setScale(0.1);
        });
        closeButton.on('pointerdown', () => {
            // Animación de salida
            this.tweens.add({
                targets: popup,
                scale: 0,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    popup.setVisible(false);
                    setSceneVisible(true); // Hacer visible la escena nuevamente
                }
            });
        });

        popup.add([popupBackground, popupText, closeButton, startButton]);

        // Función para mostrar el pop-up con el texto adecuado
        const showPopup = (message) => {
            popupText.setText(message);
            setSceneVisible(false); // Ocultar la escena cuando el pop-up aparece
            popup.setVisible(true);
            
            // Reiniciar escala y opacidad para la animación de entrada
            popup.setScale(0);
            popup.setAlpha(0);

            // Animación de entrada
            this.tweens.add({
                targets: popup,
                scale: 1,
                alpha: 1,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    // Puedes agregar código aquí si necesitas algo cuando la animación termina
                }
            });
        };

        // Función para hacer visibles o invisibles los elementos de la escena
        const setSceneVisible = (visible) => {
            background.setVisible(visible);
            logo.setVisible(visible);
            title.setVisible(visible);
            vsButton.setVisible(visible);
            coopButton.setVisible(visible);
        };

        setSceneVisible(true); // Asegúrate de que los elementos sean visibles al inicio

        const Ajustes = this.add.image(950, 50, 'configuracion').setScale(0.3);
        Ajustes.setInteractive({ cursor: 'pointer' });
        // Añadir eventos para achicar el botón al pasar el cursor
        Ajustes.on('pointerover', () => {
            Ajustes.setScale(0.25);
        });
        Ajustes.on('pointerout', () => {
            Ajustes.setScale(0.3);
        });
        Ajustes.on('pointerdown', () => {
            this.scene.start('Idioma', { language: this.language });
        });
    }

    update() {
        // Actualizaciones de la escena, si es necesario
    }
}
