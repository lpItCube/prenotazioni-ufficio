import { Seat } from "../prenota"

export interface GridPoint {
    x: number,
    y: number,
    info?: string,
    seatName?: string
}

export interface Room {
    gridPoints: GridPoint[],
    id: string,
    name: string,
    officeId: string,
    seat?: Seat[],
    xSize: number,
    ySize: number
}

export interface Office {
    domainId: string,
    id: string,
    name: string,
    room: Room[],
}

export interface Domain {
    id: string,
    name: string,
    office: Office[]
}

export interface FromToHour {
    from: string | null,
    to: string | null
}

export interface StaticCreationOptions {
    elClass: string,
    value: string,
    childClass: string
}

export interface OptionItem {
    value: string,
    label: string
}

export interface HitModalButton {
    loading: boolean,
    id: string | null
}

export interface MousePosition {
    x: number,
    y: number
}