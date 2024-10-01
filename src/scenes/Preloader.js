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
        this.load.image('logo', 'logo.png');
        this.load.image('ataque', 'fuego.png');
        this.load.image('exit', 'exit.png');
        this.load.spritesheet('barraVida', 'spritesheetVida.png', { frameWidth: 98, frameHeight: 21 });
        this.load.spritesheet('alaric_walk', 'spritesheet2.2.png', { frameWidth: 68, frameHeight: 70 });
        this.load.spritesheet('magnus_walk', 'spritesheetmagnus.png', { frameWidth: 60, frameHeight: 60 });
        this.load.image('Caja', 'caja.png');
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

    }
}
