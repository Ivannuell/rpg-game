import Phaser from 'phaser'
import { SCALE } from '../utils/shared-constants.ts'

type CharacterConfig = {
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
}

export default class Character extends Phaser.GameObjects.Sprite {
    constructor({scene, x, y, texture}: CharacterConfig) {
        super(scene, x, y, texture, 1);

        this.setScale(SCALE - 0.3)
        scene.add.existing(this);

        // scene.add.sprite(x, y, texture).setScale(2)

    }

}