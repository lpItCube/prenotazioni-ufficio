// Components
import ChairOne from "./IsometricOffice/ChairOne"
import ChairTwo from "./IsometricOffice/ChairTwo"
import ChairThree from "./IsometricOffice/ChairThree"
import ChairFour from "./IsometricOffice/ChairFour"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { toggleModal, getModalStatus } from "../../features/modalSlice"

type SeatsElementProps = {
    seat: any,
    roomType: string,
    hasBookAll: boolean,
    available: boolean,
    busy: boolean,
    isYourSeat: boolean,
    wholeRoom: any,
    isAdmin: boolean,
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
    isAdmin,
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


    let elClass = `isometric__chair ${roomType}-seat seat ${busy && "busy"} ${isYourSeat && "your"} ${available && "available"}`
    const handleAddSingleSeat = () => {
        dispatch(toggleModal(!modalStatus));
        setAction(ADD);
    }

    const handleDeleteSingleSeat = () => {
        dispatch(toggleModal(!modalStatus));
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