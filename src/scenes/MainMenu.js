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
        // Detiene la musica del vs
        const gameScene = this.scene.get('Game');
        if (gameScene && gameScene.musicaGame) {
            gameScene.musicaGame.stop();
        }
        // Detiene la música del coop
        const game2Scene = this.scene.get('Game2');
        if (game2Scene && game2Scene.musicacoop) {
            game2Scene.musicacoop.stop();
        }

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
        let howToPlayContent = ''; // Variable para el texto "Cómo jugar"

        // AGREGAR BOTON MODO VS
        const vsButton = this.add.text(150, 650, getPhrase("Modo VS"), textStyle).setOrigin(0.5);
        vsButton.setInteractive({ cursor: 'pointer' });
        vsButton.on('pointerover', () => vsButton.setScale(0.8));
        vsButton.on('pointerout', () => vsButton.setScale(1));
        vsButton.on('pointerdown', () => {
            selectedMode = 'VS';
            updateImage(selectedMode); // Actualiza la imagen
            updateHowToPlayText(selectedMode); // Actualiza el texto "Cómo jugar"
            showPopup(getPhrase('Has seleccionado el Modo VS'));
        });

        // AGREGAR BOTON MODO COOP
        const coopButton = this.add.text(850, 650, getPhrase("Modo Cooperativo"), textStyle).setOrigin(0.5);
        coopButton.setInteractive({ cursor: 'pointer' });
        coopButton.on('pointerover', () => coopButton.setScale(0.8));
        coopButton.on('pointerout', () => coopButton.setScale(1));
        coopButton.on('pointerdown', () => {
            selectedMode = 'Coop';
            updateImage(selectedMode); // Actualiza la imagen
            updateHowToPlayText(selectedMode); // Actualiza el texto "Cómo jugar"
            showPopup(getPhrase('Has seleccionado el Modo Cooperativo'));
        });

        // Agrega la imagen de "configuracion" en la posición deseada (ajusta las coordenadas si es necesario)
        const configButton = this.add.image(950, 50, 'configuracion').setScale(0.3);

        // Hacer la imagen interactiva
        configButton.setInteractive({ cursor: 'pointer' });

        // Evento al pasar el puntero por encima de la imagen
        configButton.on('pointerover', () => configButton.setScale(0.28));  // Reduce el tamaño para el efecto hover

        // Evento al quitar el puntero de la imagen
        configButton.on('pointerout', () => configButton.setScale(0.3));  // Vuelve al tamaño original

        // Evento al hacer clic en la imagen
        configButton.on('pointerdown', () => {
            this.scene.start('Idioma');  
        });

        // CREAR UN POP-UP
        const popup = this.add.container(512, 384).setVisible(false);
        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x8B4511, 1);
        popupBackground.fillRect(-400, -300, 800, 600); 

        const popupText = this.add.text(0, -220, '', {
            fontFamily: 'Pixelify Sans',
            fontSize: 28,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        const controlsText = this.add.text(0, -150, getPhrase('Controles:'), {
            fontFamily: 'Pixelify Sans',
            fontSize: 28,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        const player1Text = this.add.text(-200, -90, getPhrase('Jugador 1:'), {
            fontFamily: 'Pixelify Sans',
            fontSize: 24,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        const player2Text = this.add.text(200, -90, getPhrase('Jugador 2:'), {
            fontFamily: 'Pixelify Sans',
            fontSize: 24,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        const howToPlayText = this.add.text(0, 50, '', {
            fontFamily: 'Pixelify Sans',
            fontSize: 28,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            align: 'center',
            wordWrap: { width: 400 } // Ajusta el ancho para el contenedor
        }).setOrigin(0.5).setVisible(false);

        const flechaDerecha = this.add.image(350,50, 'flecha').setScale(1).setInteractive({ useHandCursor: true });
        flechaDerecha.on('pointerover', () => flechaDerecha.setScale(0.9));
        flechaDerecha.on('pointerout', () => flechaDerecha.setScale(1));
        flechaDerecha.on('pointerdown', () => {
            controlsText.setVisible(false);
            player1Text.setVisible(false);
            player2Text.setVisible(false);
            howToPlayText.setVisible(true); 
            howToPlayText.setText(howToPlayContent);
            vsImageContainer.setVisible(false); 
        });

        const flechaIzquierda = this.add.image(-350, 50, 'flecha').setScale(1).setFlipX(true).setInteractive({ useHandCursor: true });
        flechaIzquierda.on('pointerover', () => flechaIzquierda.setScale(0.9));
        flechaIzquierda.on('pointerout', () => flechaIzquierda.setScale(1));
        flechaIzquierda.on('pointerdown', () => {
            howToPlayText.setVisible(false);
            controlsText.setVisible(true);
            player1Text.setVisible(true);
            player2Text.setVisible(true);
            vsImageContainer.setVisible(true);
        });

        const startButton = this.add.text(0, 250, getPhrase('Comenzar'), {
            ...textStyle,
            fontSize: 36,
            fill: '#00FF00'
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

        const closeButton = this.add.image(300, -240, 'exit').setOrigin(0.5).setScale(0.1);
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
                    setSceneVisible(true); 
                    vsImageContainer.setVisible(false); 
                }
            });
        });

        popup.add([popupBackground, popupText, controlsText, player1Text, player2Text, howToPlayText, flechaIzquierda, flechaDerecha, closeButton, startButton]);

        const vsImageContainer = this.add.container(512, 384).setVisible(false);
        const vsImage = this.add.image(0, 50, 'cvs').setOrigin(0.5);
        vsImageContainer.add(vsImage);
        this.add.existing(vsImageContainer);

        const updateImage = (mode) => {
            vsImage.setTexture(mode === 'Coop' ? 'ccoop' : 'cvs');
        };

        const updateHowToPlayText = (mode) => {
            howToPlayContent = mode === 'Coop'
                ? getPhrase('Ambos jugadores deben colaborar para recordar las claves. Ademas deben eliminar a los murcielagos.')
                : getPhrase('Los jugadores compiten entre sí para derrotarse. Usa tus habilidades para superar al oponente y ganar la partida.');
        };

        const showPopup = (message) => {
            popupText.setText(message);
            controlsText.setVisible(true); 
            player1Text.setVisible(true); 
            player2Text.setVisible(true); 
            howToPlayText.setVisible(false); 
            vsImageContainer.setVisible(true); 
            setSceneVisible(false); 
            popup.setVisible(true); 
            popup.setScale(0); 
            popup.setAlpha(0); 
            this.tweens.add({
                targets: popup,
                scale: 1,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
        };

        const setSceneVisible = (visible) => {
            logo.setVisible(visible);
            title.setVisible(visible);
            vsButton.setVisible(visible);
            coopButton.setVisible(visible);
        };
    }
}
