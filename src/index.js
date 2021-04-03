import Phaser from 'phaser'
import * as scenes from './scenes'

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ffffff',
  parent: 'phaser-example',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: Object.values(scenes),
}

window.game = new Phaser.Game(config)
