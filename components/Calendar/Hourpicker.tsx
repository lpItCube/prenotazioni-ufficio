import { useState, useEffect, useRef } from 'react'

// Components
import Select from '../Ui/Select'
import Option from '../Ui/Option'

type HourpickerProps = {
    handleChangeHour: any,
    selectedDate: any
}

function Hourpicker({
    handleChangeHour,
    selectedDate
}: HourpickerProps) {

    const startTime: any[] = []
    const endTime: any[] = []

    const startRef = useRef<any>(null)
    const endRef = useRef<any>(null)

    const createOptions = (start: number, max: number, type: any) => {
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
        setStartHour(9)
        setEndHour(18)
    }, [selectedDate])


    useEffect(() => {
        // UseRef per controllare se il click è interno

        const handleClickOutside = (event: any) => {
            if (startRef.current && !startRef.current.contains(event.target)) {
                setStartOpen(false)
            } else if(endRef.current && !endRef.current.contains(event.target)) {
                setEndOpen(false)
            }
        };
        window.addEventListener('click', handleClickOutside, true);
        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };


    }, [])

    const [optionStartHours, setOptionStartHours] = useState(startTime)
    const [optionEndHours, setOptionEndHours] = useState(endTime)
    const [startHour, setStartHour] = useState(9)
    const [endHour, setEndHour] = useState(18)

    const [startOpen, setStartOpen] = useState(false)
    const [endOpen, setEndOpen] = useState(false)

    const handleOpenStartOption = () => {
        setStartOpen(prev => !prev)
    }

    const handleOpenEndOption = () => {
        setEndOpen(prev => !prev)
    }

    const handleStartHour = (hourValue: any) => {
        const currentStart = hourValue
        const startHour = parseInt(currentStart)
        setStartHour(startHour)
        createOptions(startHour + 1, 19, 'end')
        setOptionEndHours(endTime)

        handleChangeHour(String(startHour).padStart(2, '0'), String(endHour).padStart(2, '0'))
    }

    const handleEndHour = (hourValue: any) => {
        const currentEnd = hourValue
        const endHour = parseInt(currentEnd)
        setEndHour(endHour)

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
                    
                    {optionStartHours.map((hour: any) => {
                        return (
                            <Option
                                key={hour.value}
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
                    {optionEndHours.map((hour: any) => {
                        return (
                            <Option
                                key={hour.value}
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


