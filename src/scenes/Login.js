import Phaser from "phaser";

export class Login extends Phaser.Scene {
  constructor() {
    super("Login");
  }
  
  create() {
    // Fondo de pantalla
    this.add.image(1024 / 2, 768 / 2, 'fondoidioma');  // Centrado en la pantalla
    this.add.image(1024 / 2, 330, 'Anonimo').setScale(0.13);  // Centrado horizontalmente, ajusta la posición vertical
    this.add.image(1024 / 2, 475, 'Google').setScale(0.6);  // Centrado horizontalmente, ajusta la escala y la posición vertical
    this.add.image(1024 / 2, 620, 'GitHub').setScale(0.15);  // Centrado horizontalmente, ajusta la escala y la posición vertical

    // Texto "Login" centrado
    this.add.text(1024 / 2, 120, ('Login'), {
        fontFamily: 'Pixelify Sans', fontSize: 100, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);  // Asegura que esté centrado correctamente

    // Texto "Anonymous" centrado
    this.add.text(1024 / 2, 250, ('Anonimo'), {
        fontFamily: 'Pixelify Sans', fontSize: 50, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.firebase
          .signInAnonymously()
          .then(() => {
            this.scene.start("MainMenu");
          })
          .catch((error) => {
            console.log("error :(", error);
          }); 
      });

    // Texto "Google" centrado
    this.add.text(1024 / 2, 400, ('Google'), {
        fontFamily: 'Pixelify Sans', fontSize: 50, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.firebase
          .signInWithGoogle()
          .then(() => {
            this.scene.start("MainMenu");
          })
          .catch((error) => {
            console.log("error :(", error);
          });
      });

      // Texto "Github" centrado
    this.add.text(1024 / 2, 550, ('GitHub'), {
        fontFamily: 'Pixelify Sans', fontSize: 50, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.firebase
          .signInWithGithub()
          .then(() => {
            this.scene.start("MainMenu");
          })
          .catch((error) => {
            console.log("error :(", error);
          }); 
      });
}
}