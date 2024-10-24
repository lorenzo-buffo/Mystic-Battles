import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class GameOver2 extends Scene
{
    constructor ()
    {
        super('GameOver2');
    }

    create(data) {
        const mensaje = data.completo 
            ? "¡Felicidades, lograste completar todos los hechizos!" 
            : "Mala suerte, no has podido completar todos los hechizos!";
    
        this.add.text(500, 400, mensaje, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans'
        }).setOrigin(0.5);

        // Imagen "exit" para salir a la escena MainMenu
        let exitButton = this.add.image(950, 50, 'exit')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true });

        // Evento para cuando el puntero pasa por encima del botón "exit"
        exitButton.on('pointerover', () => {
            exitButton.setScale(0.09);  // Achica el botón de salida
        });

        // Evento para cuando el puntero sale del botón "exit"
        exitButton.on('pointerout', () => {
            exitButton.setScale(0.1);  // Vuelve al tamaño original
        });

        // Evento para cuando se presiona el botón "exit"
        exitButton.on('pointerdown', () => {
            this.scene.start('MainMenu');  // Cambia a la escena 'MainMenu'
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
              this.scene.start('Game2');
          });
    }
}