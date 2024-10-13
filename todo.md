
# steps for interacting signs
 ### -- Check for space input.
 ### -- then check if the facingDirection contains an object from the tile map.
 ### -- then access the objects message property then somehow display that on the screen.


 # -> Create an interaction handler
 # -> Create a message-show interface to shown in the game. 


 # things i should do
 ## -> Create a message box interface for different message type

 better object testing-> hehe early optimizatin sucks.... i know

 heres backup for check recursively....
-----> {
 this.input.keyboard!.on('keydown', (event: { key: string; }) => {
            if (event.key === ' ') {
                this.objects.forEach((object: Phaser.Types.Tilemaps.TiledObject) => {
                    if (
                        this.gridEngine.getFacingPosition('player').x === object.x! / 16 &&
                        this.gridEngine.getFacingPosition('player').y === object.y! / 16
                    ) {
                        if (object.properties) {
                            object.properties.forEach((prop: { name: string; value: any; }) => {
                                if (prop.name === 'message') {
                                    console.log(prop.value)
                                }
                            })
                        }
                        else {
                            console.log('no info')
                        }

                    }
                })
            }
        })
} <----


new thing -->


message box --

This should be activated after pressing a key or a callback is fired.

the whole world should pause and wait until the callback that activated the messagebox is done.


after interacting the action should now be 'afirm'

then there should be an amount of times the player can afrim depending on the object event.

after that we should close the message modal and set the action back to 'interact'



todo implement a multi phase message feature.



