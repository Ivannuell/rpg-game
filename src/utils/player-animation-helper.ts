import Phaser from 'phaser'

function createPlayerAnimation(
  scene: Phaser.Scene,
  texture: string,
  name: string,
  startFrame: number,
  endFrame: number,
) {
  scene.anims.create({
    key: name,
    frames: scene.anims.generateFrameNumbers(texture, {
      start: startFrame,
      end: endFrame,
    }),
    frameRate: 10,
    repeat: -1,
    yoyo: true,
  });
}

function getStopFrame(direction: string) {
  switch (direction) {
    case 'up':
      return 4;
    case 'right':
      return 10;
    case 'down':
      return 1;
    case 'left':
      return 7;
  }
}

export { getStopFrame, createPlayerAnimation }