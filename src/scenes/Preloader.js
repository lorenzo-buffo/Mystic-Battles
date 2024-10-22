import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('logo', 'logoprov.png');
        this.load.image('mapa', 'mapaslabcuadrada.png');
        this.load.spritesheet('ataque', 'boladefuegospritesheet.png', {
            frameWidth: 50, // Ancho de cada frame del spritesheet
            frameHeight: 45 // Alto de cada frame del spritesheet
        });
        this.load.spritesheet('explosion', 'explosionss39x36.png', {
            frameWidth: 39, // Ajusta el ancho según tu spritesheet
            frameHeight: 36 // Ajusta el alto según tu spritesheet
        });
        this.load.spritesheet('ataqueElectrico', 'electricidadss.png', {
            frameWidth: 50, // Ancho de cada frame del spritesheet
            frameHeight: 45 // Alto de cada frame del spritesheet
        });
        this.load.image('exit', 'exit.png')
        this.load.spritesheet('barraVida', 'spritesheetVida.png', { frameWidth: 98, frameHeight: 21 });
        this.load.spritesheet('alaric_walk', 'spritesheet2.2.png', { frameWidth: 68, frameHeight: 70 });
        this.load.spritesheet('magnus_walk', 'spritesheetmagnus.png', { frameWidth: 60, frameHeight: 60 });
        this.load.spritesheet('caja_spritesheet', 'cajasscompleto.png', { frameWidth: 50, frameHeight: 56 });
        this.load.spritesheet('pocion', 'sspocionchiquita.png', { frameWidth: 38, frameHeight: 47 });
        this.load.spritesheet('pocion_ataque', 'warningss.png', { frameWidth: 38, frameHeight: 47 });
        this.load.spritesheet('pocionElectrica', 'sspocionrayo.png', { frameWidth: 38, frameHeight: 47 });
        this.load.image('Rayo', 'rayocostado.png');
        this.load.image('Emergencia', 'emergencia.png');
        this.load.image('ingles', 'ingles.png');
        this.load.image('Español', 'Español.png');
        this.load.image('portugues', 'portugues.png');
        this.load.image('configuracion', 'config.png');
        this.load.image('flecha', 'flecha.png');
        this.load.image('cuadro', 'rollomaslargo.png'); 
        this.load.image('alaricGame2', 'placeholderalaric.png'); 
        this.load.image('magnusGame2', 'placeholdermagnus.png'); 
        this.load.image('menup', 'provisionalmenu.png'); 
        this.load.image('fondoidioma', 'idiomaF.png'); 
        this.load.spritesheet('caldero', 'caldero475x150.png', { frameWidth: 95, frameHeight: 150 });
        this.load.spritesheet('Alariccoop', 'coopalaric.png', { frameWidth: 204, frameHeight: 204 });
        this.load.spritesheet('Magnuscoop', 'coopmagnus.png', { frameWidth: 204, frameHeight: 204 });

     
} 
    create ()
    {
        
        this.scene.start('MainMenu');

        // Crear animaciones para Alaric
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers("alaric_walk", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Crear animaciones de caminar para Alaric
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('alaric_walk', { start: 4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('alaric_walk', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        
         // Crear animaciones para Magnus
         this.anims.create({
            key: 'move_magnus',
            frames: this.anims.generateFrameNumbers("magnus_walk", { start: 0, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        // Crear animaciones de caminar para Magnus
        this.anims.create({
            key: 'walk_right_magnus',
            frames: this.anims.generateFrameNumbers('magnus_walk', { start: 4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_left_magnus',
            frames: this.anims.generateFrameNumbers('magnus_walk', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });


        // Crear animación para la poción
        this.anims.create({
            key: 'pocion_appear',
            frames: this.anims.generateFrameNumbers('pocion', { start: 0, end: 3 }),
            frameRate: 5,  // Ajusta la velocidad de la animación según tu preferencia
            repeat: -1     // Para que se repita de forma indefinida
        });

        // Crear animación para la poción de ataque
        this.anims.create({
            key: 'pocion_ataque_appear',
            frames: this.anims.generateFrameNumbers('pocion_ataque', { start: 0, end: 3 }),
            frameRate: 5,  
            repeat: -1     
        });

        // Crear animación para la poción de ataque
        this.anims.create({
            key: 'pocionElectrica_appear',
            frames: this.anims.generateFrameNumbers('pocionElectrica', { start: 0, end: 3 }),
            frameRate: 5,  
            repeat: -1     
        });

        this.anims.create({
            key: 'ataqueAnim',
            frames: this.anims.generateFrameNumbers('ataque', { start: 0, end: 5 }), // Ajusta los índices según tu spritesheet
            frameRate: 10,
            repeat: -1,
        });

        // Animación de explosión
        this.anims.create({
            key: 'explosionAnim',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }), // Ajusta los índices
            frameRate: 10,
            repeat: false
        });
        //animacion ataque electrico
        this.anims.create({
            key: 'ataqueElectricoAnim',
            frames: this.anims.generateFrameNumbers('ataqueElectrico', { start: 0, end: 5 }), // Ajusta los índices según tu spritesheet
            frameRate: 10,
            repeat: -1,
        });
           // Crear la animación del caldero
        this.anims.create({
            key: 'calderoAnim',
            frames: this.anims.generateFrameNumbers('caldero', { start: 0, end: 4 }), 
            frameRate: 7, 
            repeat: -1 
        });
            // Crear la animación del caldero
            this.anims.create({
                key: 'magnusCoopAnim',
                frames: this.anims.generateFrameNumbers('Magnuscoop', { start: 0, end: 7 }), 
                frameRate: 10, 
                repeat: -1 
            });
                // Crear la animación del caldero
        this.anims.create({
            key: 'alaricCoopAnim',
            frames: this.anims.generateFrameNumbers('Alariccoop', { start: 0, end: 7 }), 
            frameRate: 10, 
            repeat: -1 
        });
      }
    }