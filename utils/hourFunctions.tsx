import { Calendar } from "../types"

export const createStartTime = (start: number, max: number, type: string) => {
    const startTime: Calendar[] = []

    for (let i = start; i < max; i++) {
            startTime.push({
                value: String(i).padStart(2, '0'),
                time: `${String(i).padStart(2, '0')}:00`,
            })
    }
    return startTime
}

export const createEndTime = (start: number, max: number, type: string) => {
    const endTime: Calendar[] = []
    for (let i = start; i < max; i++) {
            endTime.push({
                value: String(i).padStart(2, '0'),
                time: `${String(i).padStart(2, '0')}:00`,
            })
    }
    return endTime
}