import { useState, useEffect } from 'react'

// Redux
import { useDispatch } from 'react-redux'
import { setBookable, setIsYourRoom } from '../../features/roomSlice'

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
    const isPending = reserveData.find((r: Reserve) => r.status === 'pending' && r.seat.type === 'meet-whole' && (r.user.id === userId || isAdmin) ) ? true : false
    //se hai una prenotazione per quella giornata tutti i posti non sono disponibili
    const allSeatsNotAvailable = yourReserves.length > 0
    //se non hai prenotato posti in it e non ci sono posti meet occupati da altri, puoi prenotare
    const roomIsBookable = (!yourReserves?.find((r: Reserve) => r.seat.type === "it") || isAdmin) && busyResAndRoom.find((r: Reserve) => r.user.id !== userId) === undefined
    let busySeats = busyRes.map((s: Reserve) => s.seat.name)

    // Costruzione statica delle sedie nelle due stanze
    const seatsFront: String[] = rooms[id].roomType.toString() === 'meet' ? ["meet-1", "meet-2", "meet-3"] : ["it-1", "it-2", "it-3", "it-4"]
    const seatsPrimarySx: String[] = rooms[id].roomType.toString() === 'meet' ? ["meet-4"] : []
    const seatsPrimaryDx: String[] = rooms[id].roomType.toString() === 'meet' ? ["meet-5"] : []
    const seatsBack: String[] = rooms[id].roomType.toString() === 'meet' ? ["meet-6", "meet-7", "meet-8"] : ["it-5", "it-6", "it-7", "it-8"]

    const [booked, setBooked] = useState<number>(0)
    const [yourBooked, setYourBooked] = useState<number>(0)
    const [availableForYou, setAvailableForYou] = useState<number>(0)


    // Set redux room is bookable -> se è IT non è completamente prenotabile
    useEffect(() => {
        dispatch(setBookable(rooms[visibleRoom].hasBookAll))
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
 

    const Fornitures = seats[rooms[id].roomType].map((seat: any, k: number) => {
        let busy = busySeats.includes(seat) || (rooms[id].hasBookAll && wholeRoom)
        let available = !(allSeatsNotAvailable || busy) || (isAdmin && !busy)
        let isYourSeat = rooms[id].roomType.toString() === 'meet' 
            ? (allSeatsNotAvailable && yourReserves.find((r: any) => r.seat.name === seat)) || wholeRoom?.user.username === rooms[id].username
            : allSeatsNotAvailable && yourReserves.find((r: Reserve) => r.seat.name === seat)
        
        return (
            <div key={seat}>
                <SeatsElement
                    seat={seat}
                    roomType={rooms[id].roomType}
                    // elClass={elClass}
                    hasBookAll={rooms[id].hasBookAll}
                    available={available}
                    busy={busy}
                    isPending={isPending}
                    isYourSeat={isYourSeat}
                    wholeRoom={wholeRoom}
                    setSeatName={setSeatName}
                    setAction={setAction}
                    ADD={ADD}
                    DELETE={DELETE}
                    seatsFront={seatsFront}
                    seatsPrimarySx={seatsPrimarySx}
                    seatsPrimaryDx={seatsPrimaryDx}
                    seatsBack={seatsBack}
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