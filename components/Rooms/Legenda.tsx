import { useState } from 'react'

// Components
import { Colors } from '../Ui/Colors'

type LegendaProps = {
    name:string,
    color:string
}

function Legenda() {
    
    const legendaState:LegendaProps[] = [
        {
            name:'Occupato',
            color:Colors.buisy
        }, 
        {
            name:'Disponibile',
            color:Colors.available
        },
        {
            name:'Il tuo posto',
            color:Colors.yourSeat
        },
        {
            name:'Non disponibile',
            color:Colors.notAvailable
        },
    ]

    const [status, setStatus] = useState<any>(legendaState)

    return (
        <div
            className='legenda__wrapper'
        >
            {status.map((stat:any, index:number) => {
                return(
                    <div
                        key={index}
                        className='legenda__element'
                    >
                        <div 
                            className='legenda__color'
                            style={{backgroundColor:stat.color}}
                        ></div>
                        <p
                            className='legenda__name min'
                        >
                            {stat.name}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

export default Legenda