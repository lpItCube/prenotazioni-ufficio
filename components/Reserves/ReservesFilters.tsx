import { useState, useEffect, useRef } from 'react'

// Components
import Select from "../Ui/Select"
import Option from '../Ui/Option'
import { OptionItem } from '../../types'
import { useAuthHook } from '../../hooks/useAuthHook'
import { USER } from '../../_shared'

interface ReserveFiltersProps {
    setFilterMode: ({label, value}:OptionItem) => void,
    setFilterDay: ({label, value}:OptionItem) => void,
    filterMode: OptionItem,
    filterDay: OptionItem,
    showFilters: boolean
}

const ReservesFilters: React.FC<ReserveFiltersProps> = (props): JSX.Element => {

    const { setFilterMode, setFilterDay, filterMode, filterDay, showFilters } = props

    const userRef = useRef<any>(null)
    const dayRef = useRef<any>(null)
    const { userData } = useAuthHook()
    const role = userData.role

    const [userSelect, setUserSelect] = useState<boolean>(false)
    const [daySelect, setDaySelect] = useState<boolean>(false)


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserSelect(false)
            }
            if (dayRef.current && !dayRef.current.contains(event.target)) {
                setDaySelect(false)
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

    return (
        <>
            <div className={`date-tool__container date-tool__container--end${!showFilters ? ' hidden-filters' : ''}`}>
                {role !== USER && 
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
                                className={`${filterMode.value === 'otherUsers' ? ' current' : ''}`}
                            />
                        </Select>
                    </div>
                }
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