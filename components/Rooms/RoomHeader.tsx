// Components
import Button from "../Ui/Button";

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
    return (
        <div
            className="room-header__container"
        >
            <h4
                className="room-header__title"
            >
                {roomName}
            </h4>
            
            {hasBookAll &&
                // id="meetAll"
                <Button
                    type="button"
                    icon=""
                    text={`${isYourRoom ? 'Cancella prenotazione' : 'Prenota stanza'}`}
                    className={`cta btn-wholeroom ${isYourRoom ? "your" : roomIsBookable && "available"}`}
                    onClick={
                        () => {
                            setSeatName("meet-room");
                            if (roomIsBookable) {
                                setAction(ADD);
                                (document.getElementById("myModal") as HTMLElement).style.display = "flex"
                            }
                            if (isYourRoom) {
                                setAction(DELETE);
                                (document.getElementById("myModal") as HTMLElement).style.display = "flex"
                            }
                        }
                    }
                />
            }
        </div>
    )
}

export default RoomHeader