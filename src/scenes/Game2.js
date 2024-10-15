import { Scene } from 'phaser';

export class Game2 extends Scene
{
    constructor ()
    {
        super('Game2');
    }
    
    create() {
        // Agrega la imagen
        const Receta = this.add.image(500, 300, 'ingles').setScale(0.5).setAlpha(0); // Comienza invisible

        // Agrega el texto
        const texto = this.add.text(500, 180, 'Recuerda bien la receta!', {
            fontSize: '32px',
            fill: '#ffffff', // Color del texto
            align: 'center',
            fontFamily:'Pixelify Sans'
        }).setOrigin(0.5).setAlpha(0); // Comienza invisible

        // Animación de entrada para la imagen y el texto
        this.tweens.add({
            targets: [Receta, texto],
            alpha: 1,
            duration: 1000, // Duración de la animación de entrada
            ease: 'Power2',
            onComplete: () => {
                // Programa la desaparición después de 5 segundos
                this.time.delayedCall(5000, () => {
                    // Animación de salida para la imagen y el texto
                    this.tweens.add({
                        targets: [Receta, texto],
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            Receta.destroy(); // Elimina la imagen de la escena
                            texto.destroy(); // Elimina el texto de la escena
                        }
                    });
                });
            }
        });
    }
}
