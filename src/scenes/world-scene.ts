/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';
import { Direction } from "grid-engine";
import Character from '../components/player.ts';
import { createPlayerAnimation, getStopFrame } from '../helpers/player-animation-helper.ts';
import { SCALE } from '../helpers/shared-constants.ts';
import BaseScene from './base-scene.ts';
import { DATA_KEYS, dataManager } from '../utils/data-manager.ts';

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
      characters: [
        {
          id: "player",
          sprite: this.player,
          startPosition: {
            x: dataManager.store.get(DATA_KEYS.PLAYER_POS).x,
            y: dataManager.store.get(DATA_KEYS.PLAYER_POS).y
          },
          speed: 5,
        }
      ]
    })

    this.gridEngine.create(this.map, this.gridEngineConfig);
    this.onMovementEvents_player()


    //Interacting using the binded key
    this.input.keyboard!.on('keydown', (event: any) => {
      if (event.keyCode === this.KEY_BINDINGS.INTERACT && !this.wait) {
        this.interactCallback()
      }
    })

    this.time.addEvent({
      callback: () => {
        this.objects.forEach((object: any) => {
          if (object.type === 'door') {
            if (this.gridEngine.getPosition('player').x === object!.x / 16 &&
              this.gridEngine.getPosition('player').y === object!.y / 16
            ) {
              object.properties.forEach((properties: { name: string; value: string; }) => {
                if (properties.name === 'room') {
                  console.log(properties.value)
                }
              })
            }
          }
        })
      },

      repeat: -1,
      delay: 500
    })


    this.KEYS = this.input.keyboard!.addKeys(this.KEY_BINDINGS);
  }

  deltatime: number = 0;
  frame: number = 0
  update(_t: number, td: number) {

    this.deltatime += td
    this.frame++;

    if (this.deltatime > 1000) {
      console.log('FPS: ', this.frame)
      this.deltatime = 0
      this.frame = 0
    }


    if (this.KEYS.UP.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.UP);
    }
    else if (this.KEYS.LEFT.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.LEFT)
    }
    else if (this.KEYS.RIGHT.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.RIGHT);
    }
    else if (this.KEYS.DOWN.isDown && this.controllable) {
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