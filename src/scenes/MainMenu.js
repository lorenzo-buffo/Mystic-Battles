import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    init(data) {
        this.language = data.language;
    }

    create() {
        // Definir el estilo de texto global
        const textStyle = {
            fontFamily: 'Pixelify Sans',
            fontSize: 36,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        };

        // Crear los elementos de la escena
        this.add.image(512, 384, 'menup');
        const logo = this.add.image(517, 360, 'logo').setScale(0.9);
        const title = this.add.text(512, 70, getPhrase('Hora de elegir un modo de juego.'), {
            fontFamily: 'Pixelify Sans',
            fontSize: 50,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Variable para almacenar la selección del modo de juego
        let selectedMode = '';

        // AGREGAR BOTON MODO VS
        const vsButton = this.add.text(150, 650, getPhrase("Modo VS"), textStyle).setOrigin(0.5);
        vsButton.setInteractive({ cursor: 'pointer' });
        vsButton.on('pointerover', () => vsButton.setScale(0.8));
        vsButton.on('pointerout', () => vsButton.setScale(1));
        vsButton.on('pointerdown', () => {
            selectedMode = 'VS';
            showPopup(getPhrase('Has seleccionado el Modo VS'));
        });

        // AGREGAR BOTON MODO COOP
        const coopButton = this.add.text(850, 650, getPhrase("Modo Cooperativo"), textStyle).setOrigin(0.5);
        coopButton.setInteractive({ cursor: 'pointer' });
        coopButton.on('pointerover', () => coopButton.setScale(0.8));
        coopButton.on('pointerout', () => coopButton.setScale(1));
        coopButton.on('pointerdown', () => {
            selectedMode = 'Coop';
            showPopup(getPhrase('Has seleccionado el Modo Cooperativo'));
        });

        // CREAR UN POP-UP
        const popup = this.add.container(512, 384).setVisible(false);

        // Cambiar el tamaño y color del fondo del pop-up
        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x8B4511, 1);
        popupBackground.fillRect(-300, -250, 600, 500);

        const popupText = this.add.text(0, -150, '', {
            fontFamily: 'Pixelify Sans',
            fontSize: 32,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        // Botón para comenzar
        const startButton = this.add.text(0, 100, getPhrase('Comenzar'), {
            ...textStyle,  // Usa el estilo definido
            fontSize: 36
        }).setOrigin(0.5);
        startButton.setInteractive({ cursor: 'pointer' });
        startButton.on('pointerover', () => startButton.setScale(0.8));
        startButton.on('pointerout', () => startButton.setScale(1));
        startButton.on('pointerdown', () => {
            if (selectedMode === 'VS') {
                this.scene.start('Game');
            } else if (selectedMode === 'Coop') {
                this.scene.start('Game2');
            }
        });

        // Botón para cerrar el pop-up
        const closeButton = this.add.image(250, -210, 'exit').setOrigin(0.5).setScale(0.1);
        closeButton.setInteractive({ cursor: 'pointer' });
        closeButton.on('pointerover', () => closeButton.setScale(0.08));
        closeButton.on('pointerout', () => closeButton.setScale(0.1));
        closeButton.on('pointerdown', () => {
            this.tweens.add({
                targets: popup,
                scale: 0,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    popup.setVisible(false);
                    setSceneVisible(true); // Hacer visibles los elementos del menú
                }
            });
        });

        popup.add([popupBackground, popupText, closeButton, startButton]);

        // Función para mostrar el pop-up con el texto adecuado
        const showPopup = (message) => {
            popupText.setText(message);
            setSceneVisible(false); // Ocultar los elementos del menú
            popup.setVisible(true);

            popup.setScale(0);
            popup.setAlpha(0);

            this.tweens.add({
                targets: popup,
                scale: 1,
                alpha: 1,
                duration: 300,
                ease: 'Power2',
            });
        };

        // Función para hacer visibles o invisibles los elementos de la escena
        const setSceneVisible = (visible) => {
            logo.setVisible(visible);
            title.setVisible(visible);
            vsButton.setVisible(visible);
            coopButton.setVisible(visible);
        };

        setSceneVisible(true); // Hacer visibles los elementos del menú

        const Ajustes = this.add.image(950, 50, 'configuracion').setScale(0.3);
        Ajustes.setInteractive({ cursor: 'pointer' });
        Ajustes.on('pointerover', () => Ajustes.setScale(0.25));
        Ajustes.on('pointerout', () => Ajustes.setScale(0.3));
        Ajustes.on('pointerdown', () => {
            this.scene.start('Idioma', { language: this.language });
        });
    }
}
