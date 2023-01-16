import { useState } from 'react'

// Components
import { IoInformationCircleOutline } from "react-icons/io5";
import { Colors } from '../Ui/Colors';

type InfoTableProps = {
    totlaPlace: number,
    booked: number,
    yourBooked: number,
    availableForYou: number
}

function InfoTable({
    totlaPlace,
    booked,
    yourBooked,
    availableForYou
}: InfoTableProps) {

    // const [isOpen, setIsOpen] = useState(true)

    // const handleOpenInfo = () => {
    //     setIsOpen(prev => !prev)
    // }

    let totalPlaceTitle:string

    if(totlaPlace > 1) {
        totalPlaceTitle = 'I tuoi posti'
    } else {
        totalPlaceTitle = 'Il tuo posto'
    }
     
    return (
        <div
            className={`info-table__container is-open`}
        >
            {/* <div 
                className='info-table__button'
                onClick={() => handleOpenInfo()}
            >
                <div className='info-table__icon'>
                    <span></span>
                    <span></span>
                </div>
            </div> */}
            <div className='info-table__body'>
                <h6
                    className='info-table__heading'
                >Info</h6>
                <ul className='info-table__list'>
                    <li className='info-table__item'>
                        <p className='info-table__title min'>Posti totali</p>
                        <p className='info-table__data min'>{totlaPlace}</p>
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