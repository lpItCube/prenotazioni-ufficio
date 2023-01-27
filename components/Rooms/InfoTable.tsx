import { useState, useEffect } from 'react'

// Hooks
import { useAuthHook } from '../../hooks/useAuthHook';

// Redux
import { useSelector } from 'react-redux';
import { getIsYourRoom } from '../../features/roomSlice';
import { getReserves } from '../../features/reserveSlice';

type InfoTableProps = {
    wholeRoom:any,
    currentRoom:any,
    seats:any,
    busySeats:any,
    busyRes:any,
    yourReserves:any,
    compareType:any,
    className:string
}

function InfoTable({
    wholeRoom,
    currentRoom,
    seats,
    busySeats,
    busyRes,
    yourReserves,
    compareType,
    className
}: InfoTableProps) {


    const { userData } = useAuthHook()
    const isAdmin = userData.role === 'ADMIN'
    const userId = userData.id
    const isYourRoom = useSelector(getIsYourRoom)
    const reservesData = useSelector(getReserves)

    const [booked, setBooked] = useState<number>(0)
    const [yourBooked, setYourBooked] = useState<number>(0)
    const [availableForYou, setAvailableForYou] = useState<number>(0)

    // const currentReserves = reservesData.filter((res:any) => res.seat.type === compareType)

    // const free = seats[currentRoom.roomType].length - reservesData.length
    // const allRoomIsBooked = Boolean(reservesData.filter((res:any) => res.seat.type === 'meet-whole').length)
    // const yourRoom = Boolean(reservesData.filter((res:any) => res.seat.type === 'meet-whole' && res.user.id === userId).length)
    // const yourSeats = reservesData.filter((res:any) => res.user.id === userId)

    
    // console.log( currentReserves)
    // useEffect(() => {
    //     // Conta quanti posti restano disponibili per l'utente
    //     if((!isAdmin && yourReserves.length > 0) || (isAdmin && yourRoom)) {
    //         setAvailableForYou(0)
    //     } else {
    //         setAvailableForYou(free)
    //     }

    //     // Quanti posti sono prenotati?
    //     if(allRoomIsBooked) {
    //         setBooked(seats[currentRoom.roomType].length)
    //     } else if(!allRoomIsBooked) {
    //         setBooked(reservesData.length)
    //     } else {
    //         setBooked(0)
    //     }

    //     // Hai prenotato tutta la stanza?
    //     if(yourRoom) {
    //         setYourBooked(seats[currentRoom.roomType].length)
    //     } else {
    //         setYourBooked(yourSeats.length)
    //     }

    // }, [reservesData, compareType])


     // Setta quanti posti sono prenotati per giorno
     useEffect(() => {
        if (wholeRoom && currentRoom.hasBookAll) {
            // Tutta la stanza è prenotata
            setBooked(seats[currentRoom.roomType].length)
        } else if (!wholeRoom && busySeats || !currentRoom.hasBookAll && busySeats) {
            // Solo alcuni posti sono prenotati, oppure non è prenotabile tutta la stanza
            setBooked(busySeats.length)
        } else {
            setBooked(0)
        }
    }, [busyRes, wholeRoom])


    // Conta quanti posti restano disponibili per l'utente
    useEffect(() => {
        if (!isAdmin && yourReserves.length > 0) {
            setAvailableForYou(0)
        } else {
            setAvailableForYou(seats[currentRoom.roomType].length - booked)
        }
    }, [reservesData])


    useEffect(() => {
        const checkIsRoom = yourReserves?.find((r: any) => r.seat.type === "meet-whole")
        if (checkIsRoom && currentRoom.hasBookAll) {
            // Hai prenotato tutta la stanza
            setYourBooked(seats[currentRoom.roomType].length)
        } else {
            // Ne hai prenotate una, alcune o nessuna
            const yourSeats = yourReserves.filter((res: any) => res.seat.type === compareType)
            setYourBooked(yourSeats.length)
        }
    }, [isYourRoom, busyRes, yourReserves])

    let totalPlaceTitle:string

    if(seats[currentRoom.roomType].length > 1) {
        totalPlaceTitle = 'I tuoi posti'
    } else {
        totalPlaceTitle = 'Il tuo posto'
    }
     
    return (
        <div
            className={`info-table__container is-open ${className}`}
        >
            <div className='info-table__body'>
                <h6
                    className='info-table__heading'
                >Info</h6>
                <ul className='info-table__list'>
                    <li className='info-table__item'>
                        <p className='info-table__title min'>Posti totali</p>
                        <p className='info-table__data min'>{seats[currentRoom.roomType].length}</p>
                    </li>
                    <li className='info-table__item'>
                        <p className='info-table__title min'>Prenotati</p>
                        <p className='info-table__data min'>{booked}</p>
                    </li>
                    <li className='info-table__item'>
                        <p className='info-table__title min'>{totalPlaceTitle}</p>
                        <p className='info-table__data min'>{yourBooked}</p>
                    </li>
                    <li className='info-table__item'>
                        <p className='info-table__title min'>Posti disponibili</p>
                        <p className='info-table__data min'>{availableForYou}</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default InfoTable