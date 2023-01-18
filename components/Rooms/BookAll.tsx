import { useEffect, useState } from "react";

// Components
import Button from "../Ui/Button";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getIsBookable, getIsYourRoom } from "../../features/roomSlice";
import { toggleModal } from "../../features/modalSlice";
import { getUserRole } from "../../features/authSlice";

type BookAllProps = {
    setSeatName:any,
    setAction:any
}

function BookAll({
    setSeatName,
    setAction
}: BookAllProps) {

    const dispatch = useDispatch()

    const userRole = useSelector(getUserRole)
    const roomIsBookable = useSelector(getIsBookable)
    const isYourRoom = useSelector(getIsYourRoom)

    const [buttonIsVisible, setButtonIsVisible] = useState(false)

    useEffect(() => {

        if(roomIsBookable && userRole === 'ADMIN') {
            setButtonIsVisible(true)
        } else {
            setButtonIsVisible(false)
        }
    }, [roomIsBookable])
    

    if(!buttonIsVisible) {
        return null
    } else {

        return (
            <Button
                type="button"
                icon=""
                text={`${isYourRoom ? 'Cancella prenotazione' : 'Prenota stanza'}`}
                className={`cta cta--primary ${isYourRoom ? "your" : "available"}`}
                onClick={
                    () => {
                        setSeatName("meet-room");
                        dispatch(toggleModal(true));
                        if (roomIsBookable) {
                            setAction('ADD');
                        }
                        if (isYourRoom) {
                            setAction('DELETE');
                        }
                    }
                }
            />
        )
    }

}

export default BookAll