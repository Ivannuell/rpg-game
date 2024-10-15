/* eslint-disable @typescript-eslint/no-explicit-any */

import Phaser from 'phaser'
import BaseScene from './base-scene.ts'
import { SCALE } from '../helpers/shared-constants.ts';
import Character from '../components/player.ts';
import { Direction } from 'grid-engine';
import { dataManager, DATA_KEYS } from '../utils/data-manager.ts';
import { getStopFrame } from '../helpers/player-animation-helper.ts';


export default class RoomScene extends BaseScene {
    private room!: Phaser.Tilemaps.Tilemap
    KEYS: any;

    constructor() {
        super('room');
    }

    create() {

        this.room = this.add.tilemap('room-1')
        this.room.addTilesetImage('indoor-tileset-npc-1');

        const tilesets = this.room.tilesets.map((tileset) => tileset.name)
        this.cache.tilemap.get('room-1').data.layers.forEach((layer: any) => {
            if (layer.type === 'objectgroup') {
                this.objects.push(...layer.objects)
            }

            if (layer.type === 'tilelayer') {
                this.room.createLayer(layer.name, tilesets, 0, 0)
            }
        })

        this.room.layers.forEach(layer => {
            layer.tilemapLayer.setScale(SCALE)
        })

        this.player = new Character({ scene: this, x: 100, y: 100, texture: 'player' });
        this.player.setFrame(1)
        // Camera for following player
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setZoom(SCALE * 1.5)

        this.KEYS = this.input.keyboard!.addKeys(this.KEY_BINDINGS);

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
      
          this.gridEngine.create(this.room, this.gridEngineConfig);
          this.onMovementEvents_player()
      
    }

    update() {
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
}