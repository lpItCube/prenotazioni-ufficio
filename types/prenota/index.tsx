// export interface DateRange {
//     from: string | null,
//     to: string | null
// }

import { GridPoint } from "../_shared"
import { Room } from "../_shared"
import { Office } from "../_shared"

export interface Seat {
    id?: string,
    name: string,
    roomId: string,
    type: string,
    room?: Room,
    reserve?: Reserve | []
}

export interface User {
    domainId: string,
    id: string,
    password?: string,
    role: string,
    username: string
}

export interface Reserve {
    from: string,
    id: string,
    reserveDays: [],
    seat?: Seat,
    seatId: string,
    status: string,
    user: User,
    userId: string,
    to?: string
}

export interface BookStepperObj {
    id: string,
    description?: string,
    name: string,
    office?: Office[],
    room?: Room[],
    gridPoints?: GridPoint[],
    officeId?: string,
    xSize?: number,
    ySize?: number
}