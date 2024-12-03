import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Login } from './scenes/Login';
import { Game } from './scenes/Game';
import { Game2 } from './scenes/Game2';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Idioma } from './scenes/Idioma';
import { GameOver2} from './scenes/GameOver2';
import { FirebasePlugin } from './Services/FirebasePlugin';


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
    plugins: {
        global: [
          {
            key: "FirebasePlugin",
            plugin: FirebasePlugin,
            start: true,
            mapping: "firebase",
          },
        ],
      },
    scene: [ 
        Boot,
        Preloader,
        Login,
        Idioma,
        MainMenu,
        Game,
        Game2,
        GameOver,
        GameOver2,
    ]
};

export default new Phaser.Game(config);
