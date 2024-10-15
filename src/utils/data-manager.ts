import Phaser from 'phaser'
import { Direction } from 'grid-engine';

export enum DATA_KEYS {
    PLAYER_POS = 'player_pos',
    PLAYER_DIR = 'player_dir'
}

export const initialData = {
    player: {
        position: {
            x: 10,
            y: 8
        },
        direction: {
            face: Direction.DOWN,
        }
    }
}


class DataManager extends Phaser.Events.EventEmitter {
    public _store!: Phaser.Data.DataManager;

    constructor() {
        super();
        this._store = new Phaser.Data.DataManager(this);
        this.updateDataManager(initialData)
    }

    public get store(): Phaser.Data.DataManager {
        return this._store
    }

    private updateDataManager(data: typeof initialData) {
        this._store.set({
            [DATA_KEYS.PLAYER_DIR]: data.player.direction.face,
            [DATA_KEYS.PLAYER_POS]: data.player.position
        })
    }

}


export const dataManager = new DataManager()