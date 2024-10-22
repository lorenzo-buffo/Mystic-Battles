import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create(data) {
        const { ganador, victoriasAlaric, victoriasMagnus } = data;
    
        this.cameras.main.setBackgroundColor(0x000000);
        
        // Texto de Game Over
        this.add.text(500, 100,  getPhrase('Fin del juego'), {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);
        
        // Texto que indica quién ganó
        this.add.text(500, 200,  getPhrase(`${ganador} ha ganado!`), {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);
        
        // Mostrar el número de victorias
        this.add.text(500, 250, `Victorias - Alaric: ${victoriasAlaric} - Magnus: ${victoriasMagnus}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Pixelify Sans',
        }).setOrigin(0.5, 0.5);
        
        // Mostrar la imagen del ganador
        if (ganador === 'Alaric') {
            this.add.image(500, 500, 'alaricGame2').setOrigin(0.5, 0.5);
        } else if (ganador === 'Magnus') {
            this.add.image(500, 500, 'magnusGame2').setOrigin(0.5, 0.5);
        }
        
        // Opción para reiniciar el juego al hacer clic
        this.input.on('pointerdown', () => {
            this.input.removeAllListeners(); // Limpia todos los eventos de input previos
            this.scene.start('MainMenu'); // Reiniciar el juego y volver al menú principal
        });
    }
}