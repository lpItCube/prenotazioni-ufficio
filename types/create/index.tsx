export interface ITabButton {
    text: string,
    value: number,
    disabled: boolean
}

export interface GridPoint {
    x: number,
    y: number,
    info: string,
    seatName?: string | null
}

export interface XYSizes {
    x: number,
    y: number
}

export interface Room {
    id: string,
    name: string,
    gridPoints: GridPoint[],
    xSize: number,
    ySize: number
}

export interface Reserve {
    id: string,
    user: User
    userId: string,
    seat: Seat,
    seatId: string,
    from: Date,
    to: Date,
    status: string
}

export interface User {
    id: string,
    username: string
}

export interface Seat {
    name: string
    type: string
    roomId: string
}

export interface SeatProps {
    color: string,
    canvasClass: string
}

export interface Cells {
    method:string,
    value:number
}

export interface CurrentCell {
    x:number,
    y:number,
    element:null|string
}