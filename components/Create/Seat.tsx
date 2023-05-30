import { useRef, useState, useEffect } from "react"

// Types
import { GridPoint, Reserve } from "../../types";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getDayAllReserves, getDayReserves, getReserves, setReserves, setUserOnSeat } from "../../features/reserveSlice";
import { getActualRoom } from "../../features/roomSlice";
import { getModalStatus, setModalType, toggleModal } from "../../features/modalSlice";

// Costants
import { ADD, DELETE, PENDING, SEATS_MODAL, USER, WHOLE } from "../../_shared";

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
    const reservesInDay = useSelector(getDayAllReserves)

    const { userData } = useAuthHook()
    const username = userData.name
    const role = userData.role

    const [seatProps, setSeatProps] = useState<{ canvasClass: string }>({ canvasClass: "" })

    const handleAddSingleSeat = () => {
        dispatch(toggleModal(!modalStatus))
        dispatch(setModalType(SEATS_MODAL))
        setAction(ADD)
    }

    const handleDeleteSingleSeat = (cell:GridPoint) => {
        // In caso si voglia attivare la modifica a un'unica riserva per volta, andrà rilanciato il
        // setReserves al close della modale con le prenotazioni nell'attuale fascia oraria
        // console.log('CLICK HERE',filtred)
        const filtred = reserves.filter((res:Reserve) => (res?.seat?.name === cell.seatName) || (res.seat?.type === WHOLE))
        dispatch(setReserves({reserveData:filtred}))
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
        const wholeRoom = reserves.find((r: Reserve) => r.seat?.type === WHOLE)
        const isPending = reserves.find((r: Reserve) => r.status === PENDING && r.seat?.name === cell.seatName)


        if (wholeRoom) {
            const isYour = reserves.some((r: Reserve) => r.user.username === username && r.seat?.name.includes('whole'))
            const isPending = reserves.some((r: Reserve) => r.status === PENDING)
            if (isYour) {
                setSeatProps({ canvasClass: "your clickable del" })
                if (isPending) {
                    setSeatProps({ canvasClass: "pending" })
                }
            } else {
                if (!isAdmin) {
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
            const color = free ? "" : isPending ? " pending" : " buisy"
            const canvasClass = free ? "clickable" : isAdmin ? "clickable del" : ""
            setSeatProps({ canvasClass: canvasClass + color })

            if (yourReserveInRoom && !isAdmin && !yourReserve) {
                setSeatProps(prev => ({ canvasClass: `${prev.canvasClass} not-available` }))
            }
            if (yourReserve) {

                setSeatProps({ canvasClass: `${isPending ? 'pending': 'your'} clickable del` })
            }
        }

    }, [reserves, roomId, username, role])


    return (
        <div className="creation-options__seat-container">
            <div
                className={`creation-options__seat ${seatProps.canvasClass}`}
                onClick={seatProps.canvasClass === "clickable"
                    ? () => { 
                        setSeatName(cell.seatName); 
                        handleAddSingleSeat(); 
                    }
                    : seatProps.canvasClass.includes("clickable del")
                        ? () => {
                            setSeatName(cell.seatName);
                            handleDeleteSingleSeat(cell)
                        }
                        : () => {}
                }
                // Setta il nome utente del posto
                onMouseOver={() => dispatch(setUserOnSeat(
                    {userOnSeat:reservesInDay.filter((res:Reserve) => (res.seat?.name === cell.seatName) || (res.seat?.type === WHOLE))}
                    ))
                }
                onMouseLeave={() => dispatch(setUserOnSeat({userOnSeat:[]}))}
                ref={canvasRef}
            >
            </div>
        </div>
    )
}

export default Seat