import Phaser from 'phaser'

interface MessangeBoxPropConfig {
    scene: Phaser.Scene
    x: number
    y: number
    texture: string
    frame: number
}

export class MessangeBox extends Phaser.GameObjects.Image{
    constructor({scene, x, y, texture, frame}: MessangeBoxPropConfig){
        super(scene, x, y, texture, frame)

    }
}