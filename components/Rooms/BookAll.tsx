import { useEffect, useState } from "react";

// Components
import Button from "../Ui/Button";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getActualRoom, getActualRoomName, getIsBookable, getIsYourRoom } from "../../features/roomSlice";
import { toggleModal, setModalType } from "../../features/modalSlice";
import { getReserves } from "../../features/reserveSlice"

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

type BookAllProps = {
    needApproval:boolean,
    notBookAll: boolean,
    setSeatName: any,
    setAction: any,
    containerClass: string
}

function BookAll({
    needApproval,
    notBookAll,
    setSeatName,
    setAction,
    containerClass
}: BookAllProps) {

    const dispatch = useDispatch()

    const { userData } = useAuthHook()
    const userRole = userData.role
    const reserveData = useSelector(getReserves)

    const roomIsBookable = true
    const isYourRoom = useSelector(getIsYourRoom)
    const reservedIndDay = reserveData && reserveData.length > 0 && reserveData.filter((res:any) => res.seat.type === 'meet-whole')


    const [buttonIsVisible, setButtonIsVisible] = useState(false)
    const [alreadyBooked, setAlreadyBooked] = useState(false)
    const [approvalButton, setApprovalButton] = useState(false)
    const [manageButton, setManageButton] = useState(false)
    const actualRoomName = useSelector(getActualRoomName)

    useEffect(() => {

        if (roomIsBookable && userRole !== 'USER') {
            setAlreadyBooked(false)
            if(isYourRoom === notBookAll && needApproval) {
                setApprovalButton(true)
                setManageButton(true)
            } else if(reservedIndDay.length > 0) {
                setManageButton(true)
            } else {
                setManageButton(false)
                setApprovalButton(false)
                setButtonIsVisible(true)
            }
            // Se l'utente è admin e la stanza non è la tua + non è tutto prenotabile
            // mostra il bottone per approvare o cancellare la richiesta
        } else if(roomIsBookable && userRole === 'USER' && isYourRoom === notBookAll) {
            setButtonIsVisible(true)
            setAlreadyBooked(false)
        } else {
            setButtonIsVisible(false)
            setAlreadyBooked(false)
            if (isYourRoom !== notBookAll && userRole === 'USER' || reservedIndDay.length > 0 && userRole === 'USER') {
                setAlreadyBooked(true)
            } 
        }

    }, [roomIsBookable, userRole, isYourRoom, notBookAll, needApproval, reservedIndDay])


    let buttonText 
    if(approvalButton || manageButton && !isYourRoom) {
        buttonText = 'Gestisci prenotazione'
    } else if(isYourRoom) {
        buttonText = 'Gestisci prenotazione'
    } else {
        buttonText = 'Prenota stanza'
    }

        return (
            <div className={containerClass}>
                {/* {approvalButton && !manageButton && 'APPROVA'}
                {alreadyBooked && !isYourRoom && reservedIndDay.length > 0 && 'PRENOTATA DISABLED'}
                {manageButton && 'MANAGE'} */}
                {roomIsBookable && 
            
                <Button
                    type="button"
                    icon=""
                    text={buttonText}
                    className={`cta cta--primary ${alreadyBooked && !isYourRoom ? 'disabled' :isYourRoom ? "available" : "available"}`}
                    onClick={
                        () => {
                            setSeatName(`${actualRoomName}-whole`);
                            if(userRole === 'USER' && !alreadyBooked) {
                                dispatch(toggleModal(true));
                                dispatch(setModalType('seats-modal'))
                                if (roomIsBookable) {
                                    setAction('ADD');
                                }
                                if (isYourRoom) {
                                    setAction('DELETE');
                                }
                            } else if(userRole !== 'USER') {
                                dispatch(toggleModal(true));
                                if(approvalButton && !manageButton) {
                                    dispatch(setModalType('approve-modal'))
                                    setAction('APPROVE')
                                } 
                                else if (isYourRoom) {
                                    dispatch(setModalType('seats-modal'))
                                    setAction('DELETE');
                                }
                                else if (manageButton) {
                                    dispatch(setModalType('approve-modal'))
                                    setAction('MANAGE')
                                } else if (roomIsBookable) {
                                    dispatch(setModalType('seats-modal'))
                                    setAction('ADD');
                                } 
                            }
                            
                        }
                    }
                />
                }
            </div>
        )
    

}

export default BookAll