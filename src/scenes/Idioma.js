import { Scene } from 'phaser';

export class Idioma extends Scene {
    constructor() {
        super('Idioma');
        this.banderaIndex = 0;  // Índice para rastrear la bandera actual
        this.banderaTexturas = ['ingles', 'Español', 'portugues'];  // Lista de texturas de banderas
    }

    create(){
        // Agregamos la bandera inicial
        this.bandera = this.add.image(512, 384, this.banderaTexturas[this.banderaIndex])
                             .setScale(0.5)
                             .setInteractive({ useHandCursor: true });

        // Evento para cuando el puntero pasa por encima de la bandera
        this.bandera.on('pointerover', () => {
            this.bandera.setScale(0.45);  // Achica la bandera
        });

        // Evento para cuando el puntero sale de la bandera
        this.bandera.on('pointerout', () => {
            this.bandera.setScale(0.5);  // Vuelve al tamaño original
        });

        // Agregamos la flecha de avanzar (derecha)
        let flechaDerecha = this.add.image(750, 384, 'flecha')
                                   .setScale(0.3)
                                   .setInteractive({ useHandCursor: true });

        // Evento para cuando el puntero pasa por encima de la flecha derecha
        flechaDerecha.on('pointerover', () => {
            flechaDerecha.setScale(0.27);  // Achica la flecha derecha
        });

        // Evento para cuando el puntero sale de la flecha derecha
        flechaDerecha.on('pointerout', () => {
            flechaDerecha.setScale(0.3);  // Vuelve al tamaño original
        });

        // Agregamos la flecha de retroceder (izquierda) y la volteamos
        let flechaIzquierda = this.add.image(275, 384, 'flecha')
                                     .setScale(0.3)
                                     .setFlipX(true)
                                     .setInteractive({ useHandCursor: true });

        // Evento para cuando el puntero pasa por encima de la flecha izquierda
        flechaIzquierda.on('pointerover', () => {
            flechaIzquierda.setScale(0.27);  // Achica la flecha izquierda
        });

        // Evento para cuando el puntero sale de la flecha izquierda
        flechaIzquierda.on('pointerout', () => {
            flechaIzquierda.setScale(0.3);  // Vuelve al tamaño original
        });

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

        // Manejamos el evento de clic en la flecha derecha para avanzar
        flechaDerecha.on('pointerdown', () => {
            this.banderaIndex = (this.banderaIndex + 1) % this.banderaTexturas.length;
            this.bandera.setTexture(this.banderaTexturas[this.banderaIndex]);
        });

        // Manejamos el evento de clic en la flecha izquierda para retroceder
        flechaIzquierda.on('pointerdown', () => {
            this.banderaIndex = (this.banderaIndex - 1 + this.banderaTexturas.length) % this.banderaTexturas.length;
            this.bandera.setTexture(this.banderaTexturas[this.banderaIndex]);
        });
    }
}
