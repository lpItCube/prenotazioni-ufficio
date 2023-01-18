// Components
import Button from "../Ui/Button";

// Redux
import { useSelector, useDispatch } from "react-redux"
import { toggleModal, getModalStatus } from "../../features/modalSlice"


type RoomHeaderProps = {
    roomName: string,
    hasBookAll: boolean,
    isYourRoom: boolean,
    roomIsBookable: boolean,
    setSeatName: any,
    setAction: any,
    ADD: string,
    DELETE: string
}

function RoomHeader({
    roomName,
    hasBookAll,
    isYourRoom,
    roomIsBookable,
    setSeatName,
    setAction,
    ADD,
    DELETE
}: RoomHeaderProps) {

    const dispatch = useDispatch()

    return (
        <div
            className="room-header__container"
        >
            <h3
                className="room-header__title txt-h2"
            >
                {roomName}
            </h3>
            
            {/* {hasBookAll &&
                // id="meetAll"
                <Button
                    type="button"
                    icon=""
                    text={`${isYourRoom ? 'Cancella prenotazione' : 'Prenota stanza'}`}
                    className={`cta cta--primary ${isYourRoom ? "your" : roomIsBookable && "available"}`}
                    onClick={
                        () => {
                            setSeatName("meet-room");
                            dispatch(toggleModal(true));
                            if (roomIsBookable) {
                                setAction(ADD);
                            }
                            if (isYourRoom) {
                                setAction(DELETE);
                            }
                        }
                    }
                />
            } */}
        </div>
    )
}

export default RoomHeader