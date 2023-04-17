import { useRef, useState, useEffect } from "react"

// Types
import { Reserve } from "../../types";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getReserves } from "../../features/reserveSlice";
import { getActualRoom } from "../../features/roomSlice";
import { getModalStatus, setModalType, toggleModal } from "../../features/modalSlice";

// Costants
import { ADD, DELETE, SEATS_MODAL, USER } from "../../_shared";

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

interface SeatProps {
    create: boolean,
    setSeatName: (seatName: string) => void,
    setAction: (action: number) => void,
    cell: any
}

const Seat: React.FC<SeatProps> = (props): JSX.Element => {

    const { create, setSeatName, setAction, cell } = props

    const canvasRef = useRef<any>(null);

    const dispatch = useDispatch()
    const reserves = useSelector(getReserves)
    const roomId = useSelector(getActualRoom)
    const modalStatus = useSelector(getModalStatus)

    const { userData } = useAuthHook()
    const username = userData.name
    const role = userData.role

    const [seatProps, setSeatProps] = useState<{ canvasClass: string }>({ canvasClass: "" })

    const handleAddSingleSeat = () => {
        dispatch(toggleModal(!modalStatus))
        dispatch(setModalType(SEATS_MODAL))
        setAction(ADD)
    }

    const handleDeleteSingleSeat = () => {
        dispatch(toggleModal(!modalStatus))
        dispatch(setModalType(SEATS_MODAL))
        setAction(DELETE)
    }

    useEffect(() => {
        if (create) {
            setSeatProps({ canvasClass: "yours" })
            return
        }

        const isAdmin = role !== USER
        const yourReserveInRoom = reserves.find((r: Reserve) => r.user.username === username)
        const seatReserve = reserves.find((r: Reserve) => r.seat?.name === cell.seatName)
        const yourReserve = seatReserve?.user.username === username
        const wholeRoom = reserves.find((r: Reserve) => r.seat?.type === "whole")

        if (wholeRoom) {
            const isYour = reserves.some((r: Reserve) => r.user.username === username && r.seat?.name.includes('whole'))
            const isPending = reserves.some((r: Reserve) => r.status === "pending")
            if (isYour) {
                setSeatProps({ canvasClass: "your" })
                if (isPending) {
                    setSeatProps({ canvasClass: "pending clickable del" })
                }
            } else {
                if (!isAdmin) {
                    console.log('type','not admin')
                    setSeatProps({ canvasClass: "not-available" })
                }
                else {
                    if (isPending) {
                        setSeatProps({ canvasClass: `pending clickable del` })
                    } else {
                        setSeatProps({ canvasClass: `clickable del buisy` })
                    }
                }
            }
        } else {

            const free = !seatReserve
            const color = free ? "" : " buisy"
            const canvasClass = free ? "clickable" : isAdmin ? "clickable del" : ""
            setSeatProps({ canvasClass: canvasClass + color })

            if (yourReserveInRoom && !isAdmin && !yourReserve) {
                setSeatProps(prev => ({ canvasClass: `${prev.canvasClass} not-available` }))
            }
            if (yourReserve) {
                setSeatProps({ canvasClass: "your clickable del" })
            }
        }
    }, [reserves, roomId, username, role])


    return (
        <div className="creation-options__seat-container">
            <div
                className={`creation-options__seat ${seatProps.canvasClass}`}
                onClick={seatProps.canvasClass === "clickable" ?
                    () => { setSeatName(cell.seatName); handleAddSingleSeat(); } :
                    seatProps.canvasClass.includes("clickable del") ?
                        () => { setSeatName(cell.seatName); handleDeleteSingleSeat() } : () => { }
                }
                ref={canvasRef}
            >
            </div>
        </div>
    )
}

export default Seat