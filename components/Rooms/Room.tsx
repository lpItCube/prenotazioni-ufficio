import { useState, useEffect } from 'react'

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
    username: any,
    isAdmin: boolean,
    reserveData: any,
    seats: any,
    roomType: any,
    roomName: string,
    hasBookAll: boolean,
    setSeatName: any,
    setAction: any,
}

function Room({
    username,
    isAdmin,
    reserveData,
    seats,
    roomType,
    roomName,
    hasBookAll,
    setSeatName,
    setAction,
}: RoomProps) {


    const ADD = "ADD"
    const DELETE = "DELETE"

    let compareType: string

    if (roomType === 'meeting') {
        compareType = 'meet'
    } else {
        compareType = 'it'
    }

    let yourReserves = reserveData.filter((r: Reserve) => r.user.username === username)
    const wholeRoom = reserveData.find((r: Reserve) => r.seat.type === "meet-whole")
    const busyRes = reserveData.filter((r: Reserve) => r.seat.type === compareType)
    const isYourRoom = wholeRoom?.user.username === username
    const busyResAndRoom = reserveData.filter(({ seat: { type } }: Reserve) => type === "meet" || type === "meet-whole")
    //se hai una prenotazione per quella giornata tutti i posti non sono disponibili
    const allSeatsNotAvailable = yourReserves.length > 0
    //se non hai prenotato posti in it e non ci sono posti meet occupati da altri, puoi prenotare
    const roomIsBookable = (!yourReserves?.find((r: Reserve) => r.seat.type === "it") || isAdmin) && busyResAndRoom.find((r: Reserve) => r.user.username !== username) === undefined
    let busySeats = busyRes.map((s: Reserve) => s.seat.name)

    const seatsFront: String[] = roomType === 'meeting' ? ["meet-1", "meet-2", "meet-3"] : ["it-1", "it-2", "it-3", "it-4"]
    const seatsPrimarySx: String[] = roomType === 'meeting' ? ["meet-4"] : []
    const seatsPrimaryDx: String[] = roomType === 'meeting' ? ["meet-5"] : []
    const seatsBack: String[] = roomType === 'meeting' ? ["meet-6", "meet-7", "meet-8"] : ["it-5", "it-6", "it-7", "it-8"]


    const [booked, setBooked] = useState<number>(0)
    const [yourBooked, setYourBooked] = useState<number>(0)
    const [availableForYou, setAvailableForYou] = useState<number>(0)

    // Setta quanti posti sono prenotati per giorno
    useEffect(() => {
        if (wholeRoom && hasBookAll) {
            // Tutta la stanza è prenotata
            setBooked(seats[roomType].length)
        } else if (!wholeRoom && busySeats || !hasBookAll && busySeats) {
            // Solo alcuni posti sono prenotati, oppure non è prenotabile tutta la stanza
            setBooked(busySeats.length)
        } else {
            setBooked(0)
        }
    }, [busyRes, wholeRoom])

    // Conta quanti posti restano disponibili per l'utente
    useEffect(() => {
        if (!isAdmin && allSeatsNotAvailable) {
            setAvailableForYou(0)
        } else {
            setAvailableForYou(seats[roomType].length - booked)
        }
    }, [busyRes])


    useEffect(() => {
        const checkIsRoom = yourReserves?.find((r: Reserve) => r.seat.type === "meet-whole")
        if (checkIsRoom && hasBookAll) {
            // Hai prenotato tutta la stanza
            setYourBooked(seats[roomType].length)
        } else {
            // Ne hai prenotate una, alcune o nessuna
            const yourSeats = yourReserves.filter((res: any) => res.seat.type === compareType)
            setYourBooked(yourSeats.length)
        }
    }, [isYourRoom, busyRes, yourReserves])

    return (
        <>
            <RoomHeader
                roomName={roomName}
                hasBookAll={hasBookAll}
                isYourRoom={isYourRoom}
                roomIsBookable={roomIsBookable}
                setSeatName={setSeatName}
                setAction={setAction}
                ADD={ADD}
                DELETE={DELETE}
            />
            <div className="room__body">
                <InfoTable
                    totlaPlace={seats[roomType].length}
                    booked={booked}
                    yourBooked={yourBooked}
                    availableForYou={availableForYou}
                />
                <div className="room__container">
                    {seats[roomType].map((seat: any, k: number) => {
                        var busy = busySeats.includes(seat) || (hasBookAll && wholeRoom)
                        var available = !(allSeatsNotAvailable || busy) || (isAdmin && !busy)
                        var isYourSeat = roomType === 'meeting' 
                            ? (allSeatsNotAvailable && yourReserves.find((r: any) => r.seat.name === seat)) || wholeRoom?.user.username === username
                            : allSeatsNotAvailable && yourReserves.find((r: Reserve) => r.seat.name === seat)
                        

                        return (
                            <>
                                <SeatsElement
                                    seat={seat}
                                    roomType={roomType}
                                    // elClass={elClass}
                                    hasBookAll={hasBookAll}
                                    available={available}
                                    busy={busy}
                                    isYourSeat={isYourSeat}
                                    wholeRoom={wholeRoom}
                                    isAdmin={isAdmin}
                                    setSeatName={setSeatName}
                                    setAction={setAction}
                                    ADD={ADD}
                                    DELETE={DELETE}
                                    seatsFront={seatsFront}
                                    seatsPrimarySx={seatsPrimarySx}
                                    seatsPrimaryDx={seatsPrimaryDx}
                                    seatsBack={seatsBack}
                                />
                            </>
                        )
                    })}
                    <Desk
                        className={`${roomType}-desk`}
                    />
                    {roomType === 'meeting'
                        ? (
                            <MeetingRoom />
                        )
                        : (
                            <ItRoom />
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Room