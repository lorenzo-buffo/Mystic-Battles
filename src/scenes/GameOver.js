import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create(data) {
        this.cameras.main.setBackgroundColor(0x000000);
        
        // Texto de Game Over
        this.add.text(500, 100, getPhrase('Fin del juego'), {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);
        
        // Mensaje del ganador
        const winnerMessage = `${data.winner} ha ganado!`;
        this.add.text(500, 200, winnerMessage, {
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
        let exitButton = this.add.image(950, 50, 'exit')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true });

        // Evento para cuando el puntero pasa por encima del botón "exit"
        exitButton.on('pointerover', () => {
            exitButton.setScale(0.09);
        });

        // Evento para cuando el puntero sale del botón "exit"
        exitButton.on('pointerout', () => {
            exitButton.setScale(0.1);
        });

        // Evento para cuando se presiona el botón "exit"
        exitButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
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
