import { useRef, useState, useEffect } from "react"
import { Reserve, SeatProps } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { getReserves } from "../../features/reserveSlice";
import { getActualRoom } from "../../features/roomSlice";
import { getModalStatus, setModalType, toggleModal } from "../../features/modalSlice";

function Seat({ create, setSeatName, setAction, cell }: any) {
    const canvasRef = useRef<any>(null);
    const [seatProps, setSeatProps] = useState<SeatProps>({ canvasClass: "" })
    const reserves = useSelector(getReserves)
    const roomId = useSelector(getActualRoom)

    const session = useSession()
    let username: string | null | undefined = null
    let role: string | null | undefined = null

    if (session.data! !== undefined) {
        username = session.data!.user!.name
        role = session.data!.user!.role
    }

    const dispatch = useDispatch()
    const modalStatus: boolean = useSelector(getModalStatus)

    const handleAddSingleSeat = () => {
        dispatch(toggleModal(!modalStatus))
        dispatch(setModalType('seats-modal'))
        setAction("ADD")
    }

    const handleDeleteSingleSeat = () => {
        dispatch(toggleModal(!modalStatus))
        dispatch(setModalType('seats-modal'))
        setAction("DELETE")
    }

    useEffect(() => {
        if (create) {
            setSeatProps({ canvasClass: "yours" })
            return
        }
        const roomIsReserved: Reserve = reserves.find((r: Reserve) => r.seat.type === "whole" && r.seat.roomId === roomId && r.status === "accepted")
        const isAdmin = role !== "USER"
        const yourReserveInRoom = reserves.find((r: Reserve) => r.user.username === username)
        const seatReserve = reserves.find((r: Reserve) => r.seat.name === cell.seatName)
        const yourReserve = seatReserve?.user.username === username
        const wholeRoom = reserves.find((r: Reserve) => r.seat.type === "whole")

        // if (roomIsReserved) {
        //   if (roomIsReserved.user.username === username)
        //     setSeatProps({color: "yellow", canvasClass: ""})
        //   else 
        //     setSeatProps({color: "blue", canvasClass: ""})
        //   return
        // }

        if(wholeRoom) {

            const isYour = reserves.some((r: Reserve) => r.user.username === username)
            const isPending = reserves.some((r: Reserve) => r.status === "pending")
            console.log('RESEVERS',reserves)
            console.log('RESEVERS',isPending)
            if(isYour) {
                setSeatProps({ canvasClass: "your" })
                if(isPending) {
                    setSeatProps({ canvasClass: "pending" })
                }
            } else {
                setSeatProps({ canvasClass: "not-available" })
            }
        } else {

            if (yourReserve) {
                setSeatProps({ canvasClass: "your clickable del" })
                return
            }
            if (yourReserveInRoom && !isAdmin && !wholeRoom) {
                setSeatProps(prev => ({ canvasClass: `${prev.canvasClass} not-available` }))
                return
            }
    
            const free = !seatReserve
            const color = free ? "" : " buisy"
            const canvasClass = free ? "clickable" : isAdmin ? "clickable del" : ""
            setSeatProps({ canvasClass: canvasClass + color })
        }

        if(isAdmin) {
            setSeatProps(prev => ({ canvasClass: `${prev.canvasClass} clickable del` }))
        }


    }, [reserves, roomId])
    

    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;
    //     drawCanvas(canvas)
    // }, [seatProps])

    // function drawCanvas(canvas: any) {
    //     const ctx = canvas.getContext("2d");
    //     if (!ctx) return;
    //     ctx.beginPath();
    //     var xPos = (canvas.width / 2) - (20 / 2);
    //     var yPos = (canvas.height / 2) - (20 / 2);
    //     ctx.roundRect(xPos, yPos, 20, 20, 5);
    //     ctx.fillStyle = seatProps.color
    //     ctx.fill();
    //     ctx.stroke();
    // }

    return (
        <div className="creation-options__seat-container">
            {/* <canvas
                onClick={
                    seatProps.canvasClass === "clickable" ?
                        () => { setSeatName(cell.seatName); handleAddSingleSeat(); } :
                        seatProps.canvasClass === "clickable del" ?
                            () => { setSeatName(cell.seatName); handleDeleteSingleSeat() } : () => { }}
                className={seatProps.canvasClass}
                style={{ position: "relative", zIndex: "1" }}
                ref={canvasRef} width={40} height={40} /> */}
            <div
                className={`creation-options__seat ${seatProps.canvasClass}`}
                onClick={ seatProps.canvasClass === "clickable" ?
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