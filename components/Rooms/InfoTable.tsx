import { useState, useEffect } from 'react'

// Hooks
import { useAuthHook } from '../../hooks/useAuthHook';

// Redux
import { useSelector } from 'react-redux';
import { getIsYourRoom } from '../../features/roomSlice';
import { getReserves } from '../../features/reserveSlice';

type InfoTableProps = {
    currentRoom: any,
    seats: any,
    yourReserves: any,
    className: string
}

function InfoTable({
    currentRoom,
    seats,
    yourReserves,
    className
}: InfoTableProps) {


    const { userData } = useAuthHook()

    const isAdmin = userData.role !== 'USER'
    const userId = userData.id
    const isYourRoom = useSelector(getIsYourRoom)
    const reservesData = useSelector(getReserves)


    const [booked, setBooked] = useState<number>(0)
    const [yourBooked, setYourBooked] = useState<number>(0)
    const [availableForYou, setAvailableForYou] = useState<number>(0)
    const [currentReserves, setCurrentReserves] = useState<any>(reservesData)
    const [filterBookRooms, setFilterBookRooms] = useState<string>(currentRoom.roomType)


    useEffect(() => {
        const allRoomIsBooked = Boolean(reservesData.filter((res: any) => res.seat.type === 'meet-whole').length && currentRoom.roomType === 'meet')
        setFilterBookRooms(allRoomIsBooked ? 'meet-whole' : currentRoom.roomType)
    }, [currentRoom.roomType, reservesData])


    
    useEffect(() => {
        const filtredReserves = reservesData.filter((res: any) => res.seat.type === filterBookRooms)
        const yourSeat = filtredReserves.filter((res:any) => res.user.id === userId )
        setCurrentReserves(filtredReserves)
        // Conta quanti posti restano disponibili per l'utente
        if(!isAdmin && yourReserves.length > 0) {
            // Quanti posti disponibili?
            setAvailableForYou(0)
        }
        if (filterBookRooms !== 'meet' && filterBookRooms !== 'it') {
            // Quanti posti disponibili?
            setAvailableForYou(0)
            // Quanti posti sono prenotati?
            setBooked(seats[currentRoom.roomType].length)
            if(isYourRoom) {
                setYourBooked(seats[currentRoom.roomType].length)
            }
        } else {
            setAvailableForYou(seats[filterBookRooms].length - filtredReserves.length)
            setBooked(filtredReserves.length)
            setYourBooked(yourSeat.length)
        }

    }, [filterBookRooms, reservesData])

    let totalPlaceTitle: string

    if (seats[currentRoom.roomType].length > 1) {
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