/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';
import { Direction, GridEngine, GridEngineConfig } from "grid-engine";
import Character from '../components/character';
import { createPlayerAnimation, getStopFrame } from '../utils/player-animation-helper.ts';
import { SCALE } from '../utils/shared-constants.ts';
import { handleMessage_Page } from '../utils/message-helper.ts';

export default class WorldScene extends Phaser.Scene {

  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Character
  private gridEngine!: GridEngine
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private current_object_event!: Phaser.Types.Tilemaps.TiledObject | null;

  private objects: Phaser.Types.Tilemaps.TiledObject[] = []
  private controllable: boolean = true;
  private current_action: 'interact' | 'afirm'
  messageCount: string[] = [];
  currentMessageIndex = 0;
  MaxMessageIndex = 1;
  private wait = false

  constructor() {
    super('World')

    this.current_action = 'interact';
  }

  create() {

    // this.scene.launch('message-box')
    this.map = this.make.tilemap({ key: 'town-1' });

    this.map.addTilesetImage('building-tileset');
    this.map.addTilesetImage('outdoor-tileset');
    this.map.addTilesetImage('collision')
    this.add.image(0, 0, 'town-1-top-decor').setDepth(9).setScale(SCALE).setOrigin(0);


    const tilesets = this.map.tilesets.map((tileset) => tileset.name)
    console.log(tilesets)

    console.log(this.cache.tilemap.get('town-1'))


    //Create tile layer
    this.cache.tilemap.get('town-1').data.layers.forEach((layer: any) => {
      if (layer.type === 'objectgroup') {
        this.objects.push(...layer.objects)
      }

      if (layer.type === 'tilelayer') {
        this.map.createLayer(layer.name, tilesets, 0, 0)
      }
    })

    // Create object layer
    console.log(this.objects)

    this.map.layers.forEach((layer) => {
      if (layer.name === 'collision') {
        layer.tilemapLayer.setVisible(false)
      }

      if (layer.name === 'top-decors') {
        layer.tilemapLayer.setDepth(9)
      }
    })

    this.map.layers.forEach((layer) => {
      layer.tilemapLayer.setScale(SCALE)
    })

    this.player = new Character({ scene: this, x: 100, y: 100, texture: 'player' });
    this.player.setFrame(1)

    this.cameras.main.startFollow(this.player)
    this.cameras.main.setZoom(SCALE * 1.5)

    createPlayerAnimation(this, 'player', "walking-down", 0, 2);
    createPlayerAnimation(this, 'player', "walking-up", 3, 5);
    createPlayerAnimation(this, 'player', "walking-left", 6, 8);
    createPlayerAnimation(this, 'player', "walking-right", 9, 11);

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: this.player,
          startPosition: { x: 10, y: 8 },
          speed: 5,
        }
      ]
    }

    this.gridEngine.create(this.map, gridEngineConfig);

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



    // Handling object interaction
    this.input.keyboard!.on('keydown', (event: { key: string; }) => {
      if (event.key === ' ' && !this.wait) {

        switch (this.current_action) {
          case 'interact': {
            console.log('interacting')
            handleInteraction()
            break;
          }

          case 'afirm': {
            console.log('afirming')
            hanndleAfirm()
            break;
          }

        }
      }
    }
    )


    // This is called when i started interacting to an object
    const handleInteraction = () => {
      this.objects.forEach((object: Phaser.Types.Tilemaps.TiledObject) => {
        if (
          this.gridEngine.getFacingPosition('player').x === object.x! / 16 &&
          this.gridEngine.getFacingPosition('player').y === object.y! / 16 &&
          this.gridEngine.getFacingDirection('player') === Direction.UP
        ) {

          switch (object.type) {
            case 'mail': {
              this.current_object_event = object;
              this.current_action = 'afirm'
              InitObjectResponse(this.current_object_event, 'mail');
            }
          }



        }
      })
    }

    // This is called while interacting to an object
    const hanndleAfirm = () => {
      handleObjectResponse();
    }


    const InitObjectResponse = (object: Phaser.Types.Tilemaps.TiledObject, type: string) => {
      switch (type) {
        case 'mail': {

          if (object.properties) {
            object.properties.forEach((prop: { name: string; value: any; }) => {
              if (prop.name === 'message') {
                this.messageCount = handleMessage_Page(prop.value);
                console.log(this.messageCount)
                this.MaxMessageIndex = this.messageCount.length - 1;
                this.controllable = false;
                this.scene.launch('message-box', { message: this.messageCount[this.currentMessageIndex] })
              }
            })
          }

          else {
            this.controllable = false;
            this.messageCount = ['no info'];
            this.MaxMessageIndex = 0;
            this.scene.launch('message-box', { message: this.messageCount[0] })
            console.log('no info')
          }

        }
      }
    }

    const handleObjectResponse = () => {
      switch (this.current_object_event!.type) {
        case 'mail':
          if (this.currentMessageIndex !== this.MaxMessageIndex) {
              this.currentMessageIndex += 1
              this.scene.get('message-box')?.scene.restart({ message: this.messageCount[this.currentMessageIndex] })
            return;
          }

          this.current_action = 'interact';
          this.current_object_event = null;
          this.currentMessageIndex = 0;
          this.MaxMessageIndex = 0;
          this.controllable = true;
          this.scene.stop('message-box')
          console.log('interacting done')
          console.log(this.game.scene.getScenes())
          break;

        default:
          break;
      }

    }


    this.cursors = this.input.keyboard!.createCursorKeys();
  }


  update() {
    if (this.cursors!.up.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.UP);
    }
    else if (this.cursors!.left.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.LEFT);
    }
    else if (this.cursors!.right.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.RIGHT);
    }
    else if (this.cursors!.down.isDown && this.controllable) {
      this.gridEngine.move('player', Direction.DOWN);
    }
  }
}
