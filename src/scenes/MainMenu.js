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

        // AGREGAR BOTON MODO VS
        const vsButton = this.add.text(150, 650, getPhrase("Modo VS"), textStyle).setOrigin(0.5);
        vsButton.setInteractive({ cursor: 'pointer' });
        vsButton.on('pointerover', () => vsButton.setScale(0.8));
        vsButton.on('pointerout', () => vsButton.setScale(1));
        vsButton.on('pointerdown', () => {
            selectedMode = 'VS';
            updateImage(selectedMode); // Actualiza la imagen
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
            showPopup(getPhrase('Has seleccionado el Modo Cooperativo'));
        });

         // CREAR UN POP-UP
         const popup = this.add.container(512, 384).setVisible(false);

         // Cambia el tamaño y color del fondo del pop-up
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
 
         // texto para "Controles"
         const controlsText = this.add.text(0, -150, getPhrase('Controles:'), {
             fontFamily: 'Pixelify Sans',
             fontSize: 28,
             fill: '#ffffff',
             stroke: '#000000',
             strokeThickness: 7,
             align: 'center'
         }).setOrigin(0.5);
 
         // Textos para "Jugador 1" y "Jugador 2"
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
 
         // Texto oculto para "Cómo jugar"
         const howToPlayText = this.add.text(0, -140, getPhrase('Cómo jugar:'), {
             fontFamily: 'Pixelify Sans',
             fontSize: 28,
             fill: '#ffffff',
             stroke: '#000000',
             strokeThickness: 7,
             align: 'center'
         }).setOrigin(0.5).setVisible(false); // Oculto inicialmente
 
         // Agregamos la flecha de avanzar 
         let flechaDerecha = this.add.image(350,50, 'flecha')
             .setScale(1)
             .setInteractive({ useHandCursor: true });
 
         // Evento para cuando el puntero pasa por encima de la flecha derecha
         flechaDerecha.on('pointerover', () => {
             flechaDerecha.setScale(0.9);  // Achica la flecha derecha
         });
 
         // Evento para cuando el puntero sale de la flecha derecha
         flechaDerecha.on('pointerout', () => {
             flechaDerecha.setScale(1);  // Vuelve al tamaño original
         });
 
         // Lógica para mostrar "Cómo jugar" al presionar la flecha derecha
         flechaDerecha.on('pointerdown', () => {
             controlsText.setVisible(false); // Oculta el texto de controles
             player1Text.setVisible(false); // Oculta el texto de jugador 1
             player2Text.setVisible(false); // Oculta el texto de jugador 2
             howToPlayText.setVisible(true); // Muestra el texto "Cómo jugar"
             vsImageContainer.setVisible(false); // Oculta la imagen también
         });
 
         // Agregamos la flecha de retroceder (izquierda) dentro del pop-up y la volteamos
         let flechaIzquierda = this.add.image(-350, 50, 'flecha')
             .setScale(1)
             .setFlipX(true)
             .setInteractive({ useHandCursor: true });
 
         // Evento para cuando el puntero pasa por encima de la flecha izquierda
         flechaIzquierda.on('pointerover', () => {
             flechaIzquierda.setScale(0.9);  // Achica la flecha izquierda
         });
 
         // Evento para cuando el puntero sale de la flecha izquierda
         flechaIzquierda.on('pointerout', () => {
             flechaIzquierda.setScale(1);  // Vuelve al tamaño original
         });
 
         // Lógica para volver a mostrar los textos al presionar la flecha izquierda
         flechaIzquierda.on('pointerdown', () => {
             howToPlayText.setVisible(false); // Oculta el texto "Cómo jugar"
             controlsText.setVisible(true); // Vuelve a mostrar el texto de controles
             player1Text.setVisible(true); // Vuelve a mostrar el texto de jugador 1
             player2Text.setVisible(true); // Vuelve a mostrar el texto de jugador 2
             vsImageContainer.setVisible(true); // Muestra la imagen nuevamente
         });
 
         // Botón para comenzar
         const startButton = this.add.text(0, 250, getPhrase('Comenzar'), {
             ...textStyle,
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
                     setSceneVisible(true); // Hacer visibles los elementos del menú
                     vsImageContainer.setVisible(false); // Asegurarse de que la imagen se oculte también
                 }
             });
         });
 
         // Agregar todos los elementos al pop-up
         popup.add([popupBackground, popupText, controlsText, player1Text, player2Text, howToPlayText, flechaIzquierda, flechaDerecha, closeButton, startButton]);
 
         // Crear un contenedor para la imagen del modo VS
         const vsImageContainer = this.add.container(512, 384).setVisible(false);
         const vsImage = this.add.image(0, 50, 'cvs').setOrigin(0.5);
         vsImageContainer.add(vsImage);
         this.add.existing(vsImageContainer);

         const updateImage = (mode) => {
         vsImage.setTexture(mode === 'Coop' ? 'ccoop' : 'cvs');
};
 
         // Función para mostrar el pop-up con el texto adecuado
         const showPopup = (message) => {
             popupText.setText(message);
             controlsText.setVisible(true); // Asegurarse de que el texto de controles sea visible
             player1Text.setVisible(true); // Asegurarse de que el texto de jugador 1 sea visible
             player2Text.setVisible(true); // Asegurarse de que el texto de jugador 2 sea visible
             howToPlayText.setVisible(false); // Asegurarse de que "Cómo jugar" esté oculto
             vsImageContainer.setVisible(true); // Asegurarse de que la imagen sea visible
 
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