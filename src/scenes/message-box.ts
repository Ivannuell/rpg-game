import Phaser from 'phaser'
import { SCALE } from '../helpers/shared-constants.ts'
import WorldScene from './world-scene.ts'

export default class MessageBox extends Phaser.Scene {

    private message!: string
    private label!: Phaser.GameObjects.Text
    private time_event!: Phaser.Time.TimerEvent
    private ran: boolean = false
    private worldScene!: WorldScene;

    constructor() {
        super({ key: "message-box" });
    }

    init(data: { message: string; }) {
        this.message = data.message;
    }

    create() {
        this.add.image(
            this.game.config.width as number / 2,
            this.game.config.height as number / 1.9,
            'message-box-1'
        ).setScale(SCALE * 3, SCALE * 1.6);


        this.label = this.add.text(100, 850, '',
            {
                fontSize: '60px',
                color: '#000',
                fontFamily: 'Pokemon Solid',

            });
        // 

        this.typewriteText(this.message)

    }

    typewriteText(text: string) {
        const length = text.length
        let i = 0
        this.time_event = this.time.addEvent({
            callback: () => {
                this.label.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 25,

        })
        
        this.worldScene = this.scene.get('World') as WorldScene
        // this.ran = false
    }

    typewriteTextWrapped(text: string) {
        const lines = this.label.getWrappedText(text)
        const wrappedText = lines.join('\n')
        
        this.typewriteText(wrappedText)
    }

    update() {
        // console.log(this.time_event.getOverallProgress());
        if (this.time_event.getOverallProgress() === 1 && !this.ran){
            this.ran = true
            this.worldScene.resumeAfirm();
        } else if (this.time_event.getOverallProgress() !== 1) {
            this.ran = false
            this.worldScene.pauseAfirm();
        }
    }



}