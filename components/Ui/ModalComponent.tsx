// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal, getModalStatus, getModalType, setModalType } from "../../features/modalSlice"

// Components
import { IoClose } from "react-icons/io5";
import { Colors } from './Colors';

type ModalComponentProps = {
    modalTitle: string,
    subTitle: string,
    refType: string,
    children:any
}

function ModalComponent({
    modalTitle,
    subTitle,
    refType,
    children
}: ModalComponentProps) {

    const dispatch = useDispatch()
    const modalStatus: boolean = useSelector(getModalStatus)
    const modalType: string = useSelector(getModalType)

    const handleCloseModal = () => {
        dispatch(toggleModal(false))
        dispatch(setModalType(''))
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