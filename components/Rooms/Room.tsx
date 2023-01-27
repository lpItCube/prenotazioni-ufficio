import { useState, useEffect } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setBookable, setIsYourRoom, setActualRoom } from '../../features/roomSlice'
import { getReserves } from '../../features/reserveSlice';

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

// Components
import RoomHeader from './RoomHeader'
import SeatsElement from './SeatsElement'
import Desk from './IsometricOffice/Desk'
import MeetingRoom from './IsometricOffice/MeetingRoom'
import ItRoom from './IsometricOffice/ItRoom'
import InfoTable from './InfoTable'
import Legenda from './Legenda';

type User = {
    id: String,
    username: String
}

type Seat = {
    id: String,
    name: String,
    type: String
}

type Reserve = {
    user: User,
    seat: Seat,
    status: String
}

type RoomProps = {
    id:number,
    visibleRoom:number,
    seats: any,
    setSeatName: any,
    setAction: any,
    rooms: any
}

type SeatsPosition = {
    seatsFront:String[],
    seatsPrimarySx:String[],
    seatsPrimaryDx:String[],
    seatsBack:String[]
}

function Room({
    id,
    visibleRoom,
    seats,
    setSeatName,
    setAction,
    rooms
}: RoomProps) {

    const dispatch = useDispatch()

    const ADD = "ADD"
    const DELETE = "DELETE"

    let compareType: string

    const { userData } = useAuthHook()
    const userId = userData.id
    const isAdmin = userData.role === 'ADMIN'
    const reserves = useSelector(getReserves)
    const [seatsStatus, setSeatsStatus] = useState({})
    
    if (rooms[id].roomType.toString() === 'meet') {
        compareType = 'meet'
    } else {
        compareType = 'it'
    }

    const reserveData = rooms[id].reserveData

    let yourReserves = reserveData.filter((r: Reserve) => r.user.id === userId)
    const wholeRoom = reserveData.find((r: Reserve) => r.seat.type === "meet-whole")
    const busyRes = reserveData.filter((r: Reserve) => r.seat.type === compareType)
    const isYourRoom = wholeRoom?.user.id === userId
    const busyResAndRoom = reserveData.filter(({ seat: { type } }: Reserve) => type === "meet" || type === "meet-whole")
    //se hai una prenotazione per quella giornata tutti i posti non sono disponibili
    const allSeatsNotAvailable = yourReserves.length > 0
    //se non hai prenotato posti in it e non ci sono posti meet occupati da altri, puoi prenotare
    const roomIsBookable = (!yourReserves?.find((r: Reserve) => r.seat.type === "it") || isAdmin) && busyResAndRoom.find((r: Reserve) => r.user.id !== userId) === undefined
    let busySeats = busyRes.map((s: Reserve) => s.seat.name)

    // Costruzione statica delle sedie nelle due stanze
    const seatsPosition:SeatsPosition = {
        seatsFront: rooms[id].roomType.toString() === 'meet' ? ["meet-1", "meet-2", "meet-3"] : ["it-1", "it-2", "it-3", "it-4"],
        seatsPrimarySx: rooms[id].roomType.toString() === 'meet' ? ["meet-4"] : [],
        seatsPrimaryDx: rooms[id].roomType.toString() === 'meet' ? ["meet-5"] : [],
        seatsBack: rooms[id].roomType.toString() === 'meet' ? ["meet-6", "meet-7", "meet-8"] : ["it-5", "it-6", "it-7", "it-8"]
    }

    // Set redux room is bookable -> se è IT non è completamente prenotabile
    useEffect(() => {
        dispatch(setBookable(rooms[visibleRoom].hasBookAll))
        dispatch(setActualRoom(rooms[visibleRoom].roomType))
    }, [visibleRoom])

    // Set redux is your room
    useEffect(() => {
        dispatch(setIsYourRoom(wholeRoom?.user.id === userId))
    }, [isYourRoom])

    // Controlla l'animazione
    let activeClass = 'active-room'

    useEffect(() => {
        activeClass = 'in-change'
        setTimeout(() => {
            activeClass = 'active-room'
        }, 2000)
    }, [visibleRoom])
 
    

    useEffect(() => {
        const roomObj:any = []
        const busyRes = reserveData.filter((r: Reserve) => r.seat.type === rooms[visibleRoom].roomType)
        seats[rooms[visibleRoom].roomType].map((seat: any, index: number) => {
       
            const busy = Boolean(busyRes.filter((r: Reserve) => r.seat.name === seat).length || (rooms[visibleRoom].hasBookAll && wholeRoom) )
            const available = !(allSeatsNotAvailable || busy) || (isAdmin && !busy)
            const isYourSeat = rooms[id].roomType.toString() === 'meet' 
                ? Boolean((allSeatsNotAvailable && yourReserves.find((r: any) => r.seat.name === seat)) || wholeRoom?.user.username === rooms[id].username)
                : Boolean(allSeatsNotAvailable && yourReserves.find((r: Reserve) => r.seat.name === seat))
            const isPending = Boolean(reserveData.find((r: Reserve) => r.status === 'pending' && r.seat.type === 'meet-whole' && (r.user.id === userId || isAdmin) ))
            roomObj.push({
                seatId:seat,
                busy,
                available,
                isYourSeat,
                isPending
            })
        })

        setSeatsStatus(roomObj)

    }, [visibleRoom, reserveData])

    const Fornitures = seats[rooms[id].roomType].map((seat: any, index: number) => {
        return (
            <div key={seat}>
                <SeatsElement
                    index={index}
                    seat={seat}
                    roomDetails={rooms[id]}
                    seatsStatus={seatsStatus}
                    wholeRoom={wholeRoom}
                    setSeatName={setSeatName}
                    setAction={setAction}
                    ADD={ADD}
                    DELETE={DELETE}
                    seatsPosition={seatsPosition}
                />
                <Desk
                    className={`${rooms[id].roomType}-desk`}
                />
            </div>
        )
    })

    return (
        <div 
            id={`room-${id}`} 
            className={`room__wrapper ${visibleRoom === id ? activeClass : 'in-change'}`}
        >
            <div className="room__body">
                <div className="room__info">
                    <RoomHeader
                        roomName={rooms[id].roomName}
                        hasBookAll={rooms[id].hasBookAll}
                        isYourRoom={isYourRoom}
                        roomIsBookable={roomIsBookable}
                        setSeatName={setSeatName}
                        setAction={setAction}
                        ADD={ADD}
                        DELETE={DELETE}
                    />
                    <InfoTable
                        wholeRoom={wholeRoom}
                        currentRoom={rooms[visibleRoom]}
                        seats={seats}
                        busySeats={busySeats}
                        busyRes={busyRes}
                        yourReserves={yourReserves}
                        compareType={compareType}
                        className='only-desk'
                    />
                    <Legenda/>
                </div>
                <div className="room__container">
                    {rooms[id].roomType.toString() === 'meet'
                        ? (
                            <MeetingRoom>
                                {Fornitures}
                            </MeetingRoom>
                        )
                        : (
                            <ItRoom>
                                {Fornitures}
                            </ItRoom>
                        )
                    }
                </div>
                <InfoTable
                     wholeRoom={wholeRoom}
                    currentRoom={rooms[visibleRoom]}
                    seats={seats}
                    busySeats={busySeats}
                    busyRes={busyRes}
                    yourReserves={yourReserves}
                    compareType={compareType}
                    className='only-smart'
                />
            </div>
        </div>
    )
}

export default Room