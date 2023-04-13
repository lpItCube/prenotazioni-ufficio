// import { useState, useEffect, useRef } from 'react'

// // Components
// import Select from '../Ui/Select'
// import Option from '../Ui/Option'

// type HourpickerProps = {
//     handleChangeHour: any,
//     selectedDate: any
// }

// function Hourpicker({
//     handleChangeHour,
//     selectedDate
// }: HourpickerProps) {

//     const startTime: any[] = []
//     const endTime: any[] = []

//     const startRef = useRef<any>(null)
//     const endRef = useRef<any>(null)

//     const createOptions = (start: number, max: number, type: any) => {
//         for (let i = start; i < max; i++) {
//             if (type === 'start') {
//                 startTime.push({
//                     value: String(i).padStart(2, '0'),
//                     time: `${String(i).padStart(2, '0')}:00`,
//                 })
//             } else {
//                 endTime.push({
//                     value: String(i).padStart(2, '0'),
//                     time: `${String(i).padStart(2, '0')}:00`,
//                 })
//             }
//         }
//     }
    

//     useEffect(() => {
//         // UseRef per controllare se il click è interno

//         const handleClickOutside = (event: any) => {
//             if (startRef.current && !startRef.current.contains(event.target)) {
//                 setStartOpen(false)
//             }
//             if(endRef.current && !endRef.current.contains(event.target)) {
//                 setEndOpen(false)
//             }
//         };
//         window.addEventListener('click', handleClickOutside, true);
//         return () => {
//             window.removeEventListener('click', handleClickOutside, true);
//         };


//     }, [])

//     const [optionStartHours, setOptionStartHours] = useState(startTime)
//     const [optionEndHours, setOptionEndHours] = useState(endTime)
//     const [startHour, setStartHour] = useState(9)
//     const [endHour, setEndHour] = useState(10)

//     const [startOpen, setStartOpen] = useState(false)
//     const [endOpen, setEndOpen] = useState(false)


//     useEffect(() => {
//         createOptions(9, 18, 'start')
//         createOptions(10, 19, 'end')
//         setOptionStartHours(startTime)
//         setOptionEndHours(endTime)
//         setStartHour(9)
//         setEndHour(10)
//         handleChangeHour(String(9).padStart(2, '0'), String(10).padStart(2, '0'))

//     }, [selectedDate])


//     const handleOpenStartOption = () => {
//         setStartOpen(prev => !prev)
//     }

//     const handleOpenEndOption = () => {
//         setEndOpen(prev => !prev)
//     }

//     const handleStartHour = (hourValue: any) => {
//         const currentStart = hourValue
//         const startHour = parseInt(currentStart)
//         setStartHour(startHour)
//         createOptions(startHour + 1, 19, 'end')
//         setOptionEndHours(endTime)
       
//         if(endHour <= startHour) {
//             setEndHour(startHour+1)
//             handleChangeHour(String(startHour).padStart(2, '0'), String(startHour+1).padStart(2, '0'))
//         } else {
//             handleChangeHour(String(startHour).padStart(2, '0'), String(endHour).padStart(2, '0'))
//         }

//     }

//     const handleEndHour = (hourValue: any) => {
//         const currentEnd = hourValue
//         const endHour = parseInt(currentEnd)
//         setEndHour(endHour)
//         handleChangeHour(String(startHour).padStart(2, '0'), String(endHour).padStart(2, '0'))
//     }


    


//     return (
//         <>
//             <div 
//                 ref={startRef}
//                 className='select__ref'
//                 >
//                 <Select
//                     label='From'
//                     value={`${String(startHour).padStart(2, '0')}:00`}
//                     onClick={() => handleOpenStartOption}
//                     openOption={startOpen}
//                 >
                    
//                     {optionStartHours.map((hour: any) => {
//                         return (
//                             <Option
//                                 key={hour.value}
//                                 onClick={() => handleStartHour(hour.value)}
//                                 label={hour.time}
//                                 className={`${String(startHour).padStart(2, '0')}:00` === hour.time ? ' current' : ''}
//                             />
//                         )
//                     })}
//                 </Select>
//             </div>
//             <div 
//                 ref={endRef}
//                 className='select__ref'
//                 >
//                 <Select
//                     label='to'
//                     value={`${String(endHour).padStart(2, '0')}:00`}
//                     onClick={() => handleOpenEndOption}
//                     openOption={endOpen}
//                 >
//                     {optionEndHours.map((hour: any) => {
//                         return (
//                             <Option
//                                 key={hour.value}
//                                 onClick={() => handleEndHour(hour.value)}
//                                 label={hour.time}
//                                 className={`${String(endHour).padStart(2, '0')}:00` === hour.time ? ' current' : ''}
//                             />
//                         )
//                     })}
//                 </Select>
//             </div>

//         </>
//     )
// }

// export default Hourpicker




import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Components
import Select from '../Ui/Select'
import Option from '../Ui/Option'
import { getEndHour, getStartHour, setEndHour, setStartHour } from '../../features/timePickerSlice'

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
    const dispatch = useDispatch()
    const startHour = useSelector(getStartHour)
    const endHour = useSelector(getEndHour)

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
        dispatch(setStartHour(9))
        dispatch(setEndHour(10))
        
        // setStartHour(9)
        // setEndHour(10)
    }, [selectedDate])

    useEffect(() => {
        handleChangeHour(String(startHour).padStart(2, '0'), String(endHour).padStart(2, '0'))
        handleStartHour(startHour)
     
        console.log(startHour,endHour)
    }, [startHour, endHour])


    useEffect(() => {
        // UseRef per controllare se il click è interno

        const handleClickOutside = (event: any) => {
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

    const [optionStartHours, setOptionStartHours] = useState(startTime)
    const [optionEndHours, setOptionEndHours] = useState(endTime)
    // const [startHour, setStartHour] = useState(9)
    // const [endHour, setEndHour] = useState(10)

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
        // setStartHour(startHour)
        dispatch(setStartHour(startHour))
        console.log('SET HANDLE',endTime)
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

    const handleEndHour = (hourValue: any) => {
        const currentEnd = hourValue
        const endHour = parseInt(currentEnd)
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