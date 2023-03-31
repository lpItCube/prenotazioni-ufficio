import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setActualRoom } from "../../features/roomSlice"
import { setReserves } from "../../features/reserveSlice"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Room, XYSizes, Reserve } from "../../types"
import Modal from "../modal"
import GridCreate from "./GridCreate"
import Grid from "./Grid"


function HandleRoom({ fromTo, action, setAction, roomId, create }: any) {
    const [room, setRoom] = useState<Room | undefined>(undefined)
    const [xCells, setXCells] = useState<number>(0)
    const [yCells, setYCells] = useState<number>(0)
    const [xYSizes, setxYSizes] = useState<XYSizes | undefined>(undefined)
    const [seatName, setSeatName] = useState("none")
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setActualRoom(roomId))
        const getRoom = async () => {
            const res = await axios.get(`/api/room/${roomId}`)
            if (res)
                setRoom(res.data)
                setXCells(res.data.xSize)
                setYCells(res.data.ySize)
        }
        getRoom()
        const setReservess = async () => {
            const reserves = await (await axios.get(`/api/reserve`)).data
            const filteredRes = reserves.filter((r: Reserve) =>
                !(new Date(r.from) > new Date(fromTo.to as string) || new Date(r.to) < new Date(fromTo.from as string)
                ))
            console.log("cringe: ", filteredRes)
            dispatch(setReserves({ reserveData: filteredRes }))
        }
        if (!create)
            setReservess()
    }, [roomId, fromTo])

    const session = useSession()
    let username: string | null | undefined = null

    if (session.data! !== undefined)
        username = session.data!.user!.name

    // const handleXY = () => {
    //     if(xCells > 0 && yCells > 0) {
    //         setxYSizes({ x: xCells, y: yCells })
    //     }
    // }

    return (
        <>
            {create ? (
                <div className="room-creation">
                    Numbers
                    
                            <input 
                                type="number"
                                min={0}
                                value={xCells}
                                onChange={(e) => setXCells(parseInt(e.currentTarget.value))}
                            />
                            <input 
                                type="number"
                                min={0}
                                value={yCells}
                                onChange={(e) => setYCells(parseInt(e.currentTarget.value))}
                            />
                            {/* <button onClick={handleXY}>Submit Input</button> */}
                      
                    <div className="room-grid">
                        {/*PASSARE QUI X E Y*/}
                        {(room && room.xSize && room.ySize) 
                            ? <>
                                The other
                                <GridCreate 
                                    fromTo={fromTo} 
                                    setSeatName={setSeatName} 
                                    setAction={setAction} 
                                    roomId={roomId} 
                                    setRoom={setRoom} 
                                    room={room}
                                    xSize={xCells}
                                    ySize={yCells}
                                />
                            </>
                            : xCells > 0 && yCells > 0 && 
                            <>
                            This
                                <GridCreate 
                                    fromTo={fromTo} 
                                    setSeatName={setSeatName} 
                                    setAction={setAction} 
                                    roomId={roomId} 
                                    setRoom={setRoom} 
                                    room={{ xSize: xCells, ySize: yCells, gridPoints: [], name: room!.name }}
                                    xSize={xCells}
                                    ySize={yCells}
                                />
                            </>
                        }
                    </div>
                </div>
            ) : (
                <>
                    <div className="room-creation">
                        <div className="room-grid">
                            {(room && room.xSize && room.ySize) &&
                                <Grid fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} roomId={roomId} setRoom={setRoom} room={room} />
                            }
                        </div>
                    </div>
                    <Modal seatName={seatName} action={action} username={username} fromTo={fromTo} />
                </>
            )
            }
        </>
    )
}

export default HandleRoom