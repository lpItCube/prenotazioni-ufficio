import { useState, useEffect, useRef } from 'react'

// Components
import Select from "../Ui/Select"
import Option from '../Ui/Option'
import Button from '../Ui/Button'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

type ReserveFiltersProps = {
    userRole: string,
    setFilterMode: any,
    setFilterDay: any,
    setFilterRoom: any,
    filterMode: any,
    filterDay: any,
    filterRoom: any,
    showFilters: boolean
}

function ReservesFilters({
    userRole,
    setFilterMode,
    setFilterDay,
    setFilterRoom,
    filterMode,
    filterDay,
    filterRoom,
    showFilters
}: ReserveFiltersProps) {

    const [userSelect, setUserSelect] = useState(false)
    const [daySelect, setDaySelect] = useState(false)
    const [roomSelect, setRoomSelect] = useState(false)

    const userRef = useRef<any>(null)
    const dayRef = useRef<any>(null)
    const roomRef = useRef<any>(null)

    useEffect(() => {
        // UseRef per controllare se il click è interno

        const handleClickOutside = (event: any) => {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserSelect(false)
            }
            if (dayRef.current && !dayRef.current.contains(event.target)) {
                setDaySelect(false)
            }
            if (roomRef.current && !roomRef.current.contains(event.target)) {
                setRoomSelect(false)
            }

        };
        window.addEventListener('click', handleClickOutside, true);
        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };


    }, [])



    
    const handleOpenUsers = () => {
        setUserSelect(prev => !prev)
    }
    const handleOpenData = () => {
        setDaySelect(prev => !prev)
    }
    const handleOpenRoom = () => {
        setRoomSelect(prev => !prev)
    }

    return (
        <>
            <div className={`date-tool__container date-tool__container--end${!showFilters ? ' hidden-filters' : ''}`}>
                <div
                    ref={userRef}
                    className='select__ref'
                >
                    <Select
                        label='Utenti'
                        value={filterMode.label}
                        onClick={() => handleOpenUsers}
                        openOption={userSelect}
                    >
                        <Option
                            key={'myUser'}
                            onClick={() => setFilterMode({ label: 'Le mie prenotazioni', value: 'myUser' })}
                            label={'Le mie prenotazioni'}
                            className={`${filterMode.value === 'myUser' ? ' current' : ''}`}
                        />
                        <Option
                            key={'allUsers'}
                            onClick={() => setFilterMode({ label: 'Tutti gli utenti', value: '' })}
                            label={'Tutti gli utenti'}
                            className={`${filterMode.value === '' ? ' current' : ''}`}
                        />
                        <Option
                            key={'otherUsers'}
                            onClick={() => setFilterMode({ label: 'Altri utenti', value: 'otherUsers' })}
                            label={'Altri utenti'}
                            className={`${filterMode === 'otherUsers' ? ' current' : ''}`}
                        />
                    </Select>
                </div>
                <div
                    ref={roomRef}
                    className='select__ref'
                >

                    <Select
                        label='Stanza'
                        value={filterRoom.label}
                        onClick={() => handleOpenRoom}
                        openOption={roomSelect}
                    >
                        <Option
                            key={'filterDay'}
                            onClick={() => setFilterRoom({ label: 'Tutte le stanze', value: '' })}
                            label='Tutte le stanze'
                            className={`${filterRoom.value === '' ? ' current' : ''}`}
                        />
                        <Option
                            key={'stanzaIt'}
                            onClick={() => setFilterRoom({ label: 'Stanza IT', value: 'it' })}
                            label='Stanza IT'
                            className={`${filterRoom.value === 'it' ? ' current' : ''}`}
                        />
                        <Option
                            key={'stanzaMeet'}
                            onClick={() => setFilterRoom({ label: 'Stanza Meet', value: 'meet' })}
                            label='Stanza Meet'
                            className={`${filterRoom.value === 'meet' ? ' current' : ''}`}
                        />
                    </Select>
                </div>
                <div
                    ref={dayRef}
                    className='select__ref'
                >
                    <Select
                        label='Data'
                        value={filterDay.label}
                        onClick={() => handleOpenData}
                        openOption={daySelect}
                    >
                        <Option
                            key={'filterDay'}
                            onClick={() => setFilterDay({ label: 'Tutte le date', value: '' })}
                            label='Tutte le date'
                            className={`${filterDay.value === '' ? ' current' : ''}`}
                        />
                        <Option
                            key={'today'}
                            onClick={() => setFilterDay({ label: 'Oggi', value: new Date().toDateString() })}
                            label='Oggi'
                            className={`${filterDay.value === new Date().toDateString() ? ' current' : ''}`}
                        />
                    </Select>
                </div>
            </div>
        </>
    )
}

export default ReservesFilters