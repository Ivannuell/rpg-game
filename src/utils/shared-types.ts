type worldConfig = {
    maps: {
        fileName: string
        height: number
        width: number
        x: number
        y: number
    }[]
    onlyShowAdjacentMaps: boolean
    type: string
}

type mapConfig = {
    fileName: string
    height: number
    width: number
    x: number
    y: number
}

type Position = {
    x: number;
    y: number;
}


export type {worldConfig, mapConfig, Position}