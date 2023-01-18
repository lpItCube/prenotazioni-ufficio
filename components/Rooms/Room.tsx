import { useState, useEffect } from 'react'

// Redux
import { useDispatch } from 'react-redux'
import { setBookable, setIsYourRoom } from '../../features/roomSlice'

// Components
import RoomHeader from './RoomHeader'
import SeatsElement from './SeatsElement'
import Desk from './IsometricOffice/Desk'
import MeetingRoom from './IsometricOffice/MeetingRoom'
import ItRoom from './IsometricOffice/ItRoom'
import InfoTable from './InfoTable'

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
    seat: Seat
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

    
    if (rooms[id].roomType.toString() === 'meeting') {
        compareType = 'meet'
    } else {
        compareType = 'it'
    }


    let yourReserves = rooms[id].reserveData.filter((r: Reserve) => r.user.username === rooms[id].username)
    const wholeRoom = rooms[id].reserveData.find((r: Reserve) => r.seat.type === "meet-whole")
    const busyRes = rooms[id].reserveData.filter((r: Reserve) => r.seat.type === compareType)
    const isYourRoom = wholeRoom?.user.username === rooms[id].username
    const busyResAndRoom = rooms[id].reserveData.filter(({ seat: { type } }: Reserve) => type === "meet" || type === "meet-whole")
    //se hai una prenotazione per quella giornata tutti i posti non sono disponibili
    const allSeatsNotAvailable = yourReserves.length > 0
    //se non hai prenotato posti in it e non ci sono posti meet occupati da altri, puoi prenotare
    const roomIsBookable = (!yourReserves?.find((r: Reserve) => r.seat.type === "it") || rooms[id].isAdmin) && busyResAndRoom.find((r: Reserve) => r.user.username !== rooms[id].username) === undefined
    let busySeats = busyRes.map((s: Reserve) => s.seat.name)

    const seatsFront: String[] = rooms[id].roomType.toString() === 'meeting' ? ["meet-1", "meet-2", "meet-3"] : ["it-1", "it-2", "it-3", "it-4"]
    const seatsPrimarySx: String[] = rooms[id].roomType.toString() === 'meeting' ? ["meet-4"] : []
    const seatsPrimaryDx: String[] = rooms[id].roomType.toString() === 'meeting' ? ["meet-5"] : []
    const seatsBack: String[] = rooms[id].roomType.toString() === 'meeting' ? ["meet-6", "meet-7", "meet-8"] : ["it-5", "it-6", "it-7", "it-8"]

    

    const [booked, setBooked] = useState<number>(0)
    const [yourBooked, setYourBooked] = useState<number>(0)
    const [availableForYou, setAvailableForYou] = useState<number>(0)


    // Set redux room is bookable
    useEffect(() => {
        dispatch(setBookable(rooms[visibleRoom].hasBookAll))
    }, [visibleRoom])

    // Set redux is your room
    useEffect(() => {
        dispatch(setIsYourRoom(isYourRoom))
    }, [isYourRoom])

    // Controlla l'animazione
    let activeClass = 'active-room'

    useEffect(() => {
        activeClass = 'in-change'
        setTimeout(() => {
            activeClass = 'active-room'
        }, 2000)
    }, [visibleRoom])
 
    // Setta quanti posti sono prenotati per giorno
    useEffect(() => {
        if (wholeRoom && rooms[id].hasBookAll) {
            // Tutta la stanza è prenotata
            setBooked(seats[rooms[id].roomType].length)
        } else if (!wholeRoom && busySeats || !rooms[id].hasBookAll && busySeats) {
            // Solo alcuni posti sono prenotati, oppure non è prenotabile tutta la stanza
            setBooked(busySeats.length)
        } else {
            setBooked(0)
        }
    }, [busyRes, wholeRoom])

    // Conta quanti posti restano disponibili per l'utente
    useEffect(() => {
        if (!rooms[id].isAdmin && allSeatsNotAvailable) {
            setAvailableForYou(0)
        } else {
            setAvailableForYou(seats[rooms[id].roomType].length - booked)
        }
    }, [busyRes])


    useEffect(() => {
        const checkIsRoom = yourReserves?.find((r: Reserve) => r.seat.type === "meet-whole")
        if (checkIsRoom && rooms[id].hasBookAll) {
            // Hai prenotato tutta la stanza
            setYourBooked(seats[rooms[id].roomType].length)
        } else {
            // Ne hai prenotate una, alcune o nessuna
            const yourSeats = yourReserves.filter((res: any) => res.seat.type === compareType)
            setYourBooked(yourSeats.length)
        }
    }, [isYourRoom, busyRes, yourReserves])

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
                        totlaPlace={seats[rooms[id].roomType].length}
                        booked={booked}
                        yourBooked={yourBooked}
                        availableForYou={availableForYou}
                    />
                </div>
                <div className="room__container">
                    {seats[rooms[id].roomType].map((seat: any, k: number) => {
                        var busy = busySeats.includes(seat) || (rooms[id].hasBookAll && wholeRoom)
                        var available = !(allSeatsNotAvailable || busy) || (rooms[id].isAdmin && !busy)
                        var isYourSeat = rooms[id].roomType.toString() === 'meeting' 
                            ? (allSeatsNotAvailable && yourReserves.find((r: any) => r.seat.name === seat)) || wholeRoom?.user.username === rooms[id].username
                            : allSeatsNotAvailable && yourReserves.find((r: Reserve) => r.seat.name === seat)

                        return (
                                <SeatsElement
                                    key={seat}
                                    seat={seat}
                                    roomType={rooms[id].roomType}
                                    // elClass={elClass}
                                    hasBookAll={rooms[id].hasBookAll}
                                    available={available}
                                    busy={busy}
                                    isYourSeat={isYourSeat}
                                    wholeRoom={wholeRoom}
                                    isAdmin={rooms[id].isAdmin}
                                    setSeatName={setSeatName}
                                    setAction={setAction}
                                    ADD={ADD}
                                    DELETE={DELETE}
                                    seatsFront={seatsFront}
                                    seatsPrimarySx={seatsPrimarySx}
                                    seatsPrimaryDx={seatsPrimaryDx}
                                    seatsBack={seatsBack}
                                />
                        )
                    })}
                    <Desk
                        className={`${rooms[id].roomType}-desk`}
                    />
                    {rooms[id].roomType.toString() === 'meeting'
                        ? (
                            <MeetingRoom />
                        )
                        : (
                            <ItRoom />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Room