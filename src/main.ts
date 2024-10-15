import Phaser from 'phaser';
import GridEngine from 'grid-engine';
import Preload from './scenes/preloader-scene.ts';
import WorldScene from './scenes/world-scene.ts';
import MessageBox from './scenes/message-box.ts';
import BaseScene from './scenes/base-scene.ts';
import RoomScene from './scenes/room-scene.ts';

const config = {
  title: "GridEngineExample",
  pixelArt: true,
  type: Phaser.AUTO,
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  scale: {
    width: 1920,
    height: 1080,
    mode: Phaser.Scale.FIT,
    autocenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Preload,
    WorldScene,
    MessageBox,
    RoomScene,
    BaseScene
  ],
  parent: "game",
  backgroundColor: "#48C4F8",
  input: {
    mouse: {
      preventDefaultWheel: false
    },
    touch: {
      capture: false
    }
  }
};

export const game = new Phaser.Game(config)