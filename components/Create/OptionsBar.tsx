import { CurrentCell } from "../../types"
import { useEffect, useState } from "react"
import { RiDeleteBin3Line } from "react-icons/ri"
import { Colors } from "../Ui/Colors"

interface OptionsBarProps {
    currentCell: CurrentCell,
    handleOptionChange: (e: any) => void
}

const staticCreationElement = [
    {
        elClass:"creation-options__element",
        value:"chair",
        childClass:"creation-options__seat"
    },
    {
        elClass:"creation-options__element--vLine",
        value:"vLineTop",
        childClass:"creation-options__table--vertical"
    },
    {
        elClass:"creation-options__element--vLine bottom",
        value:"vLineBottom",
        childClass:"creation-options__table--vertical"
    },
    {
        elClass:"creation-options__element--hLine",
        value:"hLineLeft",
        childClass:"creation-options__table--horizontal"
    },
    {
        elClass:"creation-options__element--hLine right",
        value:"hLineRight",
        childClass:"creation-options__table--horizontal"
    },
    {
        elClass:"creation-options__element",
        value:"tr",
        childClass:"creation-options__table--angle-tr"
    },
    {
        elClass:"creation-options__element",
        value:"tl",
        childClass:"creation-options__table--angle-tl"
    },
    {
        elClass:"creation-options__element",
        value:"br",
        childClass:"creation-options__table--angle-br"
    },
    {
        elClass:"creation-options__element",
        value:"bl",
        childClass:"creation-options__table--angle-bl"
    },
    // {
    //     elClass:"creation-options__element clear",
    //     value:"clear",
    //     childClass:"",
    //     icon:<RiDeleteBin3Line color={Colors.white} size={24} />
    // },
]

function OptionsBar(props: OptionsBarProps) {
    const {
        currentCell,
        handleOptionChange
    } = props

    const [currentSelected, setCurrentSelected] = useState(currentCell.element)

    useEffect(() => {
        setCurrentSelected(currentCell.element)
    }, [currentCell])
    
    return (
        <div
            className="creation-options__wrapper"
        >
            {staticCreationElement.map((el:any) => {
                return(
                    <button
                        key={el.value}
                        className={`${el.elClass}${currentSelected === el.value && el.value !== 'clear' ? ' selected':''}`}
                        onClick={() => {
                            handleOptionChange(el.value)
                            setCurrentSelected(el.value)
                        }}
                        >
                            <div className={el.childClass}>
                            </div>
                        </button>
                )
            })}
            {(currentSelected !== '') && 
                <button
                    className={`creation-options__element clear`}
                    onClick={() => {
                        handleOptionChange('')
                        setCurrentSelected('')
                    }}
                    >
                        <div className=''>
                            <RiDeleteBin3Line color={Colors.white} size={24} />
                        </div>
                </button>
            }
        </div>
    )
}

export default OptionsBar