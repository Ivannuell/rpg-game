/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';
import { Direction } from "grid-engine";
import Character from '../components/character';
import { createPlayerAnimation, getStopFrame } from '../utils/player-animation-helper.ts';
import { SCALE } from '../utils/shared-constants.ts';
import BaseScene from './base-scene.ts';

export default class WorldScene extends BaseScene {

  private map!: Phaser.Tilemaps.Tilemap;
  private KEYS!: any

  constructor() {
    super('World')
  }

  create() {

    
    this.map = this.make.tilemap({ key: 'town-1' });
    this.map.addTilesetImage('building-tileset');
    this.map.addTilesetImage('outdoor-tileset');
    this.map.addTilesetImage('collision')
    this.add.image(0, 0, 'town-1-top-decor').setDepth(9).setScale(SCALE).setOrigin(0);

    //Create tile layer
    const tilesets = this.map.tilesets.map((tileset) => tileset.name)
    this.cache.tilemap.get('town-1').data.layers.forEach((layer: any) => {
      if (layer.type === 'objectgroup') {
        this.objects.push(...layer.objects)
      }

      if (layer.type === 'tilelayer') {
        this.map.createLayer(layer.name, tilesets, 0, 0)
      }
    })

    // Set layer custom properties
    this.map.layers.forEach((layer) => {
      if (layer.name === 'collision') {
        layer.tilemapLayer.setVisible(false)
      }

      if (layer.name === 'top-decors') {
        layer.tilemapLayer.setDepth(9)
      }

      layer.tilemapLayer.setScale(SCALE)
    })

    // Main player creation
    this.player = new Character({ scene: this, x: 100, y: 100, texture: 'player' });
    this.player.setFrame(1)
    // Camera for following player
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setZoom(SCALE * 1.5)

    // Moving animation for player
    createPlayerAnimation(this, 'player', "walking-down", 0, 2);
    createPlayerAnimation(this, 'player', "walking-up", 3, 5);
    createPlayerAnimation(this, 'player', "walking-left", 6, 8);
    createPlayerAnimation(this, 'player', "walking-right", 9, 11);

    // Grid-Engine stuffs
    this.createGEConfig({
      player: this.player
    })
    this.gridEngine.create(this.map, this.gridEngineConfig);
    this.onMovementEvents_player()

    this.input.keyboard!.on('keydown', (event: {key: string}) => {
      if (event.key === ' ' && !this.wait){
        console.log('dkdj'); 
        this.interactCallback()
      }
    })

    this.KEYS = this.input.keyboard!.addKeys(this.KEY_BINDINGS);
  }

deltatime: number = 0;
frame: number = 0

  update(t: number, td: number) {
    
    this.deltatime += td
    this.frame++;

    if (this.deltatime > 1000){
      console.log('FPS: ', this.frame)
      this.deltatime = 0
      this.frame = 0
    }


    if (this.KEYS.UP.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.UP);
    }
    if (this.KEYS.LEFT.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.LEFT)
    }
    if (this.KEYS.RIGHT.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.RIGHT);
    }
    if (this.KEYS.DOWN.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.DOWN);
    }

  }


  onMovementEvents_player() {
    this.gridEngine.movementStarted().subscribe(({ direction }) => {
      this.player.anims.play(`walking-${direction}`);
    })

    this.gridEngine.movementStopped().subscribe(({ direction }) => {
      this.player.anims.stop();
      this.player.setFrame(`${getStopFrame(direction)}`);
    });

    this.gridEngine.directionChanged().subscribe(({ direction }) => {
      this.player.setFrame(`${getStopFrame(direction)}`);
    });
  }


  pauseAfirm() {
    this.wait = true;
    
  }

  resumeAfirm() {
    this.time.addEvent({
      callback: () => {
        this.wait = false
      },
      delay: 400
    })
  }


}