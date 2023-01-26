import { useState } from 'react'

// Components
import { Colors } from '../Ui/Colors'
import { HiOutlineLightBulb } from "react-icons/hi";
import Button from '../Ui/Button';
import ModalComponent from '../Ui/ModalComponent';

// Redux
import { useSelector, useDispatch } from "react-redux"
import { toggleModal, setModalType } from '../../features/modalSlice';

type LegendaProps = {
    name: string,
    color: string
}

function Legenda() {

    const dispatch = useDispatch()

    const legendaState: LegendaProps[] = [
        {
            name: 'Occupato',
            color: Colors.buisy
        },
        {
            name: 'Disponibile',
            color: Colors.available
        },
        {
            name: 'Il tuo posto',
            color: Colors.yourSeat
        },
        {
            name: 'Non disponibile',
            color: Colors.notAvailable
        },
        {
            name: 'In attesa',
            color: Colors.pending
        }
    ]


    const [status] = useState<any>(legendaState)

    const handleOpenLegenda = () => {
        dispatch(toggleModal(true))
        dispatch(setModalType('legenda-modal'))
    }

    return (
        <div
            className='legenda__wrapper'
        >
            <div className='legenda__button-wrapper'>
                <Button
                    className='cta cta--border-primary legenda__button'
                    onClick={() => handleOpenLegenda()}
                    type='button'
                    icon={<HiOutlineLightBulb size={18} />}
                    text='Legenda'
                />
            </div>
            <div className='legenda__element-wrapper'>
                <ModalComponent
                    modalTitle='Legenda'
                    refType='legenda-modal'
                    subTitle=''
                >
                    <div className='legenda__modal-container'>

                        {status.map((stat: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className='legenda__element'
                                >
                                    <div
                                        className='legenda__color'
                                        style={{ backgroundColor: stat.color }}
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
                </ModalComponent>
            </div>
        </div>
    )
}

export default Legenda