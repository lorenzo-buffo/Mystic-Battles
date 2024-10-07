import { Scene } from 'phaser';

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
        this.add.text(400, 100, 'Game Over', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    
        // Texto que indica quién ganó
        this.add.text(400, 200, `${ganador} ha ganado!`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    
        // Mostrar el número de victorias
        this.add.text(400, 250, `Victorias - Alaric: ${victoriasAlaric} - Magnus: ${victoriasMagnus}`, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    
        // Mostrar la imagen del ganador
        if (ganador === 'Alaric') {
            this.add.image(400, 350, 'Alaric3').setOrigin(0.5, 0.5);
        } else if (ganador === 'Magnus') {
            this.add.image(400, 350, 'Magnus3').setOrigin(0.5, 0.5);
        }
        
        // Opción para reiniciar el juego
        this.input.on('pointerdown', () => {
            this.scene.start('Game'); // Reiniciar el juego
        });
    }
}
