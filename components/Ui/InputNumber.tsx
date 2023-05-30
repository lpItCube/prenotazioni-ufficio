import { useState, useEffect } from "react"
import Button from "./Button"
import { IoAdd, IoRemove } from "react-icons/io5";

interface InputNumberProps {
    label?:string,
    min: number,
    max?: number,
    value: number,
    onChange: (value: number) => void
}

function InputNumber(props: InputNumberProps) {

    const {
        label,
        min,
        max,
        value,
        onChange
    } = props

    const [inputValue, setInputValue] = useState<number>(0)

    useEffect(() => {
        setInputValue(value)
    },[value])

    useEffect(() => {
        console.log('RERENDER')
        onChange(inputValue)
    }, [inputValue, onChange])
   
    return (
        <div
            className="input-number__wrapper"
        >
            {label && 
                <label
                    className="select__label label"
                >
                    {label}
                </label>
            }
            <div className="input-number__container">
                <Button
                    onClick={() => setInputValue(prev => prev -1)}
                    className='cta cta--primary round cta__icon'
                    type='button'
                    icon={<IoRemove size={16} />}
                    text=''
                />
                <input
                    type="number"
                    min={min}
                    max={max}
                    value={inputValue !== null ? inputValue : 0}
                    onChange={(e) => setInputValue(parseInt(e.currentTarget.value))}
                />
                <Button
                    onClick={() => setInputValue(prev => prev +1)}
                    className='cta cta--primary round cta__icon'
                    type='button'
                    icon={<IoAdd size={16} />}
                    text=''
                />
            </div>
        </div>
    )
}

export default InputNumber