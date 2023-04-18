import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getEndHour, getStartHour, setEndHour, setStartHour } from '../../features/timePickerSlice'

// Components
import Select from '../Ui/Select'
import Option from '../Ui/Option'

// Types
import { Calendar } from '../../types'

interface HourpickerProps {
    handleChangeHour: (start: string, end: string) => void,
    selectedDate: Date
}

const Hourpicker: React.FC<HourpickerProps> = (props): JSX.Element => {

    const { handleChangeHour, selectedDate } = props

    const startTime: Calendar[] = []
    const endTime: Calendar[] = []

    const startRef = useRef<any>(null)
    const endRef = useRef<any>(null)
    const dispatch = useDispatch()
    const startHour = useSelector(getStartHour)
    const endHour = useSelector(getEndHour)

    const createOptions = (start: number, max: number, type: string) => {
        for (let i = start; i < max; i++) {
            if (type === 'start') {
                startTime.push({
                    value: String(i).padStart(2, '0'),
                    time: `${String(i).padStart(2, '0')}:00`,
                })
            } else {
                endTime.push({
                    value: String(i).padStart(2, '0'),
                    time: `${String(i).padStart(2, '0')}:00`,
                })
            }
        }
    }

   

    useEffect(() => {
        createOptions(9, 18, 'start')
        createOptions(10, 19, 'end')
        setOptionStartHours(startTime)
        setOptionEndHours(endTime)
        dispatch(setStartHour(9))
        dispatch(setEndHour(10))
    }, [selectedDate])

    useEffect(() => {
        handleChangeHour(String(startHour).padStart(2, '0'), String(endHour).padStart(2, '0'))
        handleStartHour(startHour)
    }, [startHour, endHour])


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (startRef.current && !startRef.current.contains(event.target)) {
                setStartOpen(false)
            }
            if(endRef.current && !endRef.current.contains(event.target)) {
                setEndOpen(false)
            }
        };
        window.addEventListener('click', handleClickOutside, true);
        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };


    }, [])

    const [optionStartHours, setOptionStartHours] = useState<Calendar[]>(startTime)
    const [optionEndHours, setOptionEndHours] = useState<Calendar[]>(endTime)


    const [startOpen, setStartOpen] = useState<boolean>(false)
    const [endOpen, setEndOpen] = useState<boolean>(false)

    const handleOpenStartOption = () => {
        setStartOpen(prev => !prev)
    }

    const handleOpenEndOption = () => {
        setEndOpen(prev => !prev)
    }

    const handleStartHour = (hourValue: string | number) => {
        const currentStart = hourValue
        const startHour = typeof(hourValue) === 'number' ? hourValue : parseInt(currentStart as string)
        dispatch(setStartHour(startHour))
        createOptions(startHour + 1, 19, 'end')
        setOptionEndHours(endTime)

        if(endHour <= startHour) {
            // setEndHour(startHour+1)
            dispatch(setEndHour(startHour+1))
            handleChangeHour(String(startHour).padStart(2, '0'), String(startHour+1).padStart(2, '0'))
        } else {
            handleChangeHour(String(startHour).padStart(2, '0'), String(endHour).padStart(2, '0'))
        }
    }

    const handleEndHour = (hourValue: string | number) => {
        const currentEnd = hourValue
        const endHour = typeof(hourValue) === 'number' ? hourValue : parseInt(currentEnd as string)
        dispatch(setEndHour(endHour))
        // setEndHour(endHour)

        handleChangeHour(String(startHour).padStart(2, '0'), String(endHour).padStart(2, '0'))
    }


    return (
        <>
            <div 
                ref={startRef}
                className='select__ref'
                >
                <Select
                    label='From'
                    value={`${String(startHour).padStart(2, '0')}:00`}
                    onClick={() => handleOpenStartOption}
                    openOption={startOpen}
                >
                    
                    {optionStartHours.map((hour: any, index:number) => {
                        return (
                            <Option
                                key={index}
                                onClick={() => handleStartHour(hour.value)}
                                label={hour.time}
                                className={`${String(startHour).padStart(2, '0')}:00` === hour.time ? ' current' : ''}
                            />
                        )
                    })}
                </Select>
            </div>
            <div 
                ref={endRef}
                className='select__ref'
                >
                <Select
                    label='to'
                    value={`${String(endHour).padStart(2, '0')}:00`}
                    onClick={() => handleOpenEndOption}
                    openOption={endOpen}
                >
                    {optionEndHours.map((hour: any, index:number) => {
                        return (
                            <Option
                                key={index}
                                onClick={() => handleEndHour(hour.value)}
                                label={hour.time}
                                className={`${String(endHour).padStart(2, '0')}:00` === hour.time ? ' current' : ''}
                            />
                        )
                    })}
                </Select>
            </div>

        </>
    )
}

export default Hourpicker