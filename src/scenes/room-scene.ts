
import Phaser from 'phaser'
import BaseScene from './base-scene.ts'


export default class RoomScene extends BaseScene {
    private room!: Phaser.Tilemaps.Tilemap

    constructor() {
        super('room');
    }

    create() {

        this.room = this.add.tilemap('room-1')
        
    }
}