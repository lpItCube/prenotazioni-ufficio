// Components
import ChairOne from "./IsometricOffice/ChairOne"
import ChairTwo from "./IsometricOffice/ChairTwo"
import ChairThree from "./IsometricOffice/ChairThree"
import ChairFour from "./IsometricOffice/ChairFour"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { toggleModal, getModalStatus, setModalType } from "../../features/modalSlice"
import { getUserRole } from "../../features/authSlice";

type SeatsElementProps = {
    seat: any,
    roomType: string,
    hasBookAll: boolean,
    available: boolean,
    busy: boolean,
    isYourSeat: boolean,
    wholeRoom: any,
    setSeatName: any,
    setAction: any,
    ADD: string,
    DELETE: string,
    seatsFront: any,
    seatsPrimarySx: any,
    seatsPrimaryDx: any,
    seatsBack: any,
}

function SeatsElement({
    seat,
    roomType,
    hasBookAll,
    available,
    busy,
    isYourSeat,
    wholeRoom,
    setSeatName,
    setAction,
    ADD,
    DELETE,
    seatsFront,
    seatsPrimarySx,
    seatsPrimaryDx,
    seatsBack,
}: SeatsElementProps) {

    const dispatch = useDispatch()
    const modalStatus:boolean = useSelector(getModalStatus)

    const isAdmin = useSelector(getUserRole) === 'ADMIN'

    let elClass = `isometric__chair ${roomType}-seat seat ${busy && "busy"} ${isYourSeat && "your"} ${available && "available"}`
    const handleAddSingleSeat = () => {
        dispatch(toggleModal(!modalStatus));
        dispatch(setModalType('seats-modal'))
        setAction(ADD);
    }

    const handleDeleteSingleSeat = () => {
        dispatch(toggleModal(!modalStatus));
        dispatch(setModalType('seats-modal'))
        // console.log('OK OPEN')
        setAction(DELETE);
    }

    return (
        <div
            id={seat}
            className={elClass}
            onClick={
                () => {
                    setSeatName(seat);
                    if (hasBookAll) {
                        if (!wholeRoom) {
                            if (available || (isAdmin && !busy)) {
                                handleAddSingleSeat()
                            } else if (isYourSeat || (isAdmin && busy)) {
                                handleDeleteSingleSeat()
                            }
                        }
                    } else {
                        if (available || (isAdmin && !busy)) {
                            handleAddSingleSeat()
                        } else if (isYourSeat || (isAdmin && busy)) {
                            handleDeleteSingleSeat()
                        }
                    }
                }
            }
        >
            {seatsFront.indexOf(seat) > -1 && <ChairOne />}
            {seatsPrimarySx.indexOf(seat) > -1 && <ChairTwo />}
            {seatsBack.indexOf(seat) > -1 && <ChairThree />}
            {seatsPrimaryDx.indexOf(seat) > -1 && <ChairFour />}
        </div>


    )
}

export default SeatsElement