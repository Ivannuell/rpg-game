const SCALE: number = 2
const MAX_WORD_LINE: number = 38


export let DIALOG_DONE: boolean = false

export function dialog_true() {
    DIALOG_DONE = true
}

export function dialog_false() {
    DIALOG_DONE = true
}


export { SCALE, MAX_WORD_LINE }