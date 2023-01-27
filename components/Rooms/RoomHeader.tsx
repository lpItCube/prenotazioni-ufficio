type RoomHeaderProps = {
    roomName: string
}

function RoomHeader({
    roomName
}: RoomHeaderProps) {

    return (
        <div
            className="room-header__container"
        >
            <h3
                className="room-header__title txt-h2"
            >
                {roomName}
            </h3>
        </div>
    )
}

export default RoomHeader