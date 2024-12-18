import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create(data) {
        this.scene.get('Game').musicaGame.stop();
         this.add.image(512, 384, 'fondoidioma');
        // Texto de Game Over
        this.add.text(500, 150, getPhrase('Fin del juego'), {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);
        
        // Mensaje del ganador
        const winnerMessage = getPhrase(`${data.winner} ha ganado!`);
        this.add.text(500, 220, winnerMessage, {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);

        // Mostrar la imagen del personaje ganador
        const characterImageKey = this.getCharacterImageKey(data.winner);
        if (characterImageKey) {
            this.add.image(500, 400, characterImageKey).setScale(1).setOrigin(0.5, 0.5);
        }

        // Imagen "exit" para salir a la escena MainMenu
        let exitButton = this.add.image(511, 50, 'exit')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true });

        // Evento para cuando el puntero pasa por encima del botón "exit"
        exitButton.on('pointerover', () => {
            exitButton.setScale(0.08);
        });

        // Evento para cuando el puntero sale del botón "exit"
        exitButton.on('pointerout', () => {
            exitButton.setScale(0.09);
        });

        // Evento para cuando se presiona el botón "exit"
        exitButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

         // Imagen "reset" para volver a la escena game
         const resetButton = this.add.image(500, 600, 'reset')
         .setScale(1)
         .setInteractive({ useHandCursor: true });
 
         resetButton.on('pointerover', () => {
            resetButton.setScale(0.9);
         });
 
         resetButton.on('pointerout', () => {
            resetButton.setScale(1);
         });
 
         resetButton.on('pointerdown', () => {
             this.scene.start('Game');
         });
    }

    // Función para obtener la clave de la imagen del personaje basado en el nombre
    getCharacterImageKey(winner) {
        const characterImageMap = {
            'Alaric': 'alaricGame2', // Asegúrate que el nombre coincida con lo que envías en data.winner
            'Magnus': 'magnusGame2', // Lo mismo aquí
        };

        return characterImageMap[winner] || null; // Retorna null si no hay una imagen para el ganador
    }
}
