

function handleMessage_Line(msg: string) {
    return msg.split('\n')
}

function handleMessage_Page(msg: string) {
    return msg.split('::')
}



export {handleMessage_Line, handleMessage_Page}