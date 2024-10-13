import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.setPath('public/assets/');

        // MAPS
        this.load.tilemapTiledJSON('town-1', 'tiled/maps/town-1.json');
        this.load.tilemapTiledJSON('town-2', 'tiled/maps/town-2.json');

        // TILESETS
        this.load.image('building-tileset', 'tiled/building-tileset.png');
        this.load.image('outdoor-tileset', 'tiled/outdoor-tileset.png');
        this.load.image('collision', 'tiled/collision_tileset.png');

        //COMPONENT IMGS
        this.load.image('town-1-top-decor', 'tiled/maps/town-1-top-decor.png');
        this.load.image('message-box-1', 'tiled/Components/message-box-1.png');

        // SPRITES
        this.load.spritesheet('player', 'sprites/characters/overworld_character.png', {
            frameWidth: 16,
            frameHeight: 24
        });

    }

    create() {
        this.scene.start('World')
    }

}
