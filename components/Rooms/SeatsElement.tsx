// Components
import ChairOne from "./IsometricOffice/ChairOne"
import ChairTwo from "./IsometricOffice/ChairTwo"
import ChairThree from "./IsometricOffice/ChairThree"
import ChairFour from "./IsometricOffice/ChairFour"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { toggleModal, getModalStatus, setModalType } from "../../features/modalSlice"

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

type SeatsElementProps = {
    index:any,
    seat: any,
    roomDetails:any,
    seatsStatus:any,
    wholeRoom: any,
    setSeatName: any,
    setAction: any,
    ADD: string,
    DELETE: string,
    seatsPosition:any,
}

function SeatsElement({
    index,
    seat,
    roomDetails,
    seatsStatus,
    wholeRoom,
    setSeatName,
    setAction,
    ADD,
    DELETE,
    seatsPosition
}: SeatsElementProps) {

    const dispatch = useDispatch()
    const modalStatus:boolean = useSelector(getModalStatus)
    const { userData } = useAuthHook()
    const isAdmin = userData.role !== 'USER'

    const status = seatsStatus[index]
    // let elClass 
    // if(status) elClass=`${roomDetails.roomType}-seat seat${status.busy && !status.isPending ? " busy" : ""}${status.isYourSeat ? " your" : ""}${status.available ? " available" : ""}${status.isPending && roomDetails.roomType === 'meet' ? " pending" : "" }`
    
    let seatClass
    if(status) {
        // occupata e non tua ROSSO
        if(status.busy && !status.isYourSeat && !status.isPending) {
            seatClass = 'busy'
        } 
        // occupata e è tua GIALLO
        if(status.busy && status.isYourSeat && !status.isPending ) {
            seatClass = 'your'
        }
        // non occupata
        if(status.available) {
            seatClass = 'available'
        }
        // pending
        if(status.isPending && roomDetails.roomType === 'meet') {
            seatClass = 'pending'
        }
    }

    const handleAddSingleSeat = () => {
        dispatch(toggleModal(!modalStatus));
        dispatch(setModalType('seats-modal'))
        setAction(ADD);
    }

    const handleDeleteSingleSeat = () => {
        dispatch(toggleModal(!modalStatus));
        dispatch(setModalType('seats-modal'))
        setAction(DELETE);
    }

    return (
        <div
            id={seat}
            className={`isometric__chair ${roomDetails.roomType}-seat seat ${seatClass}`}
            onClick={
                () => {
                    setSeatName(seat);
                    if (roomDetails.hasBookAll) {
                        if (!wholeRoom) {
                            if (status.available || (isAdmin && !status.busy)) {
                                handleAddSingleSeat()
                            } else if (status.isYourSeat || (isAdmin && status.busy)) {
                                handleDeleteSingleSeat()
                            }
                        }
                    } else {
                        if (status.available || (isAdmin && !status.busy)) {
                            handleAddSingleSeat()
                        } else if (status.isYourSeat || (isAdmin && status.busy)) {
                            handleDeleteSingleSeat()
                        }
                    }
                }
            }
        >

            {seatsPosition.seatsFront.indexOf(seat) > -1 && <ChairOne />}
            {seatsPosition.seatsPrimarySx.indexOf(seat) > -1 && <ChairTwo />}
            {seatsPosition.seatsBack.indexOf(seat) > -1 && <ChairThree />}
            {seatsPosition.seatsPrimaryDx.indexOf(seat) > -1 && <ChairFour />}
        </div>


    )
}

export default SeatsElement