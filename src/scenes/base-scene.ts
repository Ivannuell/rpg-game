import Phaser from 'phaser'
import { GridEngine, GridEngineConfig, Direction } from 'grid-engine'
import Character from '../components/character';
import { handleMessage_Page } from '../utils/message-helper';

export type KEY_BINDINGS_types = {
    LEFT: Phaser.Input.Keyboard.Key;
    RIGHT: Phaser.Input.Keyboard.Key;
    UP: Phaser.Input.Keyboard.Key;
    DOWN: Phaser.Input.Keyboard.Key;
    ESC: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
    ENTER: Phaser.Input.Keyboard.Key;
}

type characters_prop = {
    player: Phaser.GameObjects.Sprite;
}

export default class BaseScene extends Phaser.Scene {


    protected KEY_BINDINGS = {
        LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
        RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        UP: Phaser.Input.Keyboard.KeyCodes.UP,
        DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
        ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
        SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }

    protected gridEngineConfig!: GridEngineConfig;
    protected gridEngine!: GridEngine

    protected player!: Character
    protected current_object_event!: Phaser.Types.Tilemaps.TiledObject | null;
    protected objects: Phaser.Types.Tilemaps.TiledObject[] = []
    protected controllable: boolean = true;
    protected current_action: 'interact' | 'afirm'
    protected messageCount: string[] = [];
    protected currentMessageIndex = 0;
    protected MaxMessageIndex = 1;
    protected wait = false

    constructor(key: string) {
        super({ key: key })
        this.current_action = 'interact';
    }


    createGEConfig(characters: characters_prop) {
        this.gridEngineConfig = {
            characters: [
                {
                    id: "player",
                    sprite: characters.player,
                    startPosition: { x: 10, y: 8 },
                    speed: 5,
                }
            ]
        }

        return this.gridEngineConfig
    }

    update(t: number, dt: number) {
        console.log(t)
    }

    interactCallback() {
        // Interaction logics
        // This is called when i started interacting to an object

        console.log('in BaseScene')
        switch (this.current_action) {
            case 'interact': {
                console.log('interacting')
                this.handleInteraction()
                break;
            }

            case 'afirm': {
                console.log('afirming')
                this.hanndleAfirm()
                break;
            }

        }
    }

    handleInteraction = () => {
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
                        this.InitObjectResponse(this.current_object_event, 'mail');
                    }
                }
            }
        })
    }

    // This is called while interacting to an object
    hanndleAfirm = () => {
       this.onObjectResponse();
    }


    InitObjectResponse = (object: Phaser.Types.Tilemaps.TiledObject, type: string) => {
        switch (type) {
            case 'mail': {
                if (object.properties) {
                    object.properties.forEach((prop: { name: string; value: string; }) => {
                        if (prop.name === 'message') {
                            this.messageCount = handleMessage_Page(prop.value);
                            this.MaxMessageIndex = this.messageCount.length - 1;
                            this.controllable = false;
                            this.scene.launch('message-box', { message: this.messageCount[this.currentMessageIndex] })
                        }
                    })
                } else {
                    this.controllable = false;
                    this.messageCount = ['no info'];
                    this.MaxMessageIndex = 0;
                    this.scene.launch('message-box', { message: this.messageCount[0] })
                }

            }
        }
    }

    onObjectResponse = () => {
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
                break;

            default:
                break;
        }




    }
}
