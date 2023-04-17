export interface ITabButton {
    text: string,
    value: number,
    disabled: boolean
}

export interface XYSizes {
    x: number,
    y: number
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

export enum FormMethod {
    SELEZIONA,
    AGGIUNGI
}