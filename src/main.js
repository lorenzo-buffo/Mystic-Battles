import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { Game2 } from './scenes/Game2';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
    },
    scene: [ 
        Boot,
        Preloader,
        MainMenu,
        Game,
        Game2,
        GameOver
    ]
};

export default new Phaser.Game(config);
