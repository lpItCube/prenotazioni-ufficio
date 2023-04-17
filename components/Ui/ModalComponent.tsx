// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal, getModalStatus, getModalType, setModalType } from "../../features/modalSlice"

// Components
import { IoClose } from "react-icons/io5";
import { Colors } from './Colors';
import { PRISTINE } from '../../_shared';

type ModalComponentProps = {
    modalTitle: string,
    subTitle: string,
    refType: number,
    children:any
}

const ModalComponent: React.FC<ModalComponentProps> = (props): JSX.Element => {

    const { modalTitle, subTitle, refType, children } = props

    const dispatch = useDispatch()
    const modalStatus = useSelector(getModalStatus)
    const modalType = useSelector(getModalType)

    const handleCloseModal = () => {
        dispatch(toggleModal(false))
        dispatch(setModalType(PRISTINE))
    }

    return (
        <div
            className={`modal${modalStatus && modalType === refType ? ' show-modal' : ''}`}
        >
            <div onClick={() => handleCloseModal()} className={`modal__obscurer${modalStatus && modalType === refType ? ' active' : ''}`}></div>
            <div className="modal__content">
                <div className="modal__header">
                    <div className='modal__title'>
                        <h5
                            className="semiBold"
                        >
                            {modalTitle}
                        </h5>
                        {subTitle &&
                            <p className='label'>
                                {subTitle}
                            </p>
                        }
                    </div>
                    <div
                        onClick={() => handleCloseModal()}
                        className="modal__close">
                        <IoClose
                            size={32}
                            color={Colors.light700}
                        />
                    </div>
                </div>
                <div className="modal__body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalComponent