import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { setActualRoom, setActualRoomName } from "../../features/roomSlice"
import { setReserves } from "../../features/reserveSlice"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Room, Reserve, GridPoint, CurrentCell } from "../../types"
import Modal from "../modal"
import GridCreate from "./GridCreate"
import Grid from "./Grid"
import { AnimatePresence, motion } from "framer-motion";
import OptionsBar from "./OptionsBar"
import GridOptions from "./GridOptions"


function HandleRoom({ fromTo, action, setAction, roomId, create }: any) {

    const variants = {
        initial: {
            opacity: 0,
            y: 8
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            }
        },
        hidden: {
            opacity: 0,
            y: 8,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            }
        }
    };

    const optionRef = useRef<any>(null)
    const [room, setRoom] = useState<Room | undefined>(undefined)
    const [xCells, setXCells] = useState<number>(0)
    const [yCells, setYCells] = useState<number>(0)
    const [grid, setGrid] = useState<GridPoint[][]>([])
    const [seatName, setSeatName] = useState("none")
    const [seats, setSeats] = useState<any[]>([])
    const [selectedCell, setSelectedCell] = useState<GridPoint | null>(null)
    const [showOptions, setShowOptions] = useState<boolean>(false)
    const [currentCell, setCurrentCell] = useState<CurrentCell>({ x: -1, y: -1, element: null })
    const [updateGrid, setUpdateGrid] = useState<any>([])
    const dispatch = useDispatch()


    useEffect(() => {
        // UseRef per controllare se il click è interno
        const handleClickOutside = (event: any) => {
            if (optionRef.current && optionRef.current.contains(event.target)) {
                setShowOptions(true)
            } else {
                setShowOptions(false)
            }
        };
        window.addEventListener('click', handleClickOutside, true);
        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };
    }, [])


    useEffect(() => {
        dispatch(setActualRoom(roomId))
        const getRoom = async () => {
            const res = await axios.get(`/api/room/${roomId}`)
            if (res) {
                setRoom(res.data)
                dispatch(setActualRoomName(res?.data?.name))
                setXCells(res.data?.xSize)
                setYCells(res.data?.ySize)
            }
        }
        getRoom()
        const setReservess = async () => {
            // console.log('SET RES 3')
            const reserves = await (await axios.get(`/api/reserve`)).data
            // const filteredRes = reserves.filter((r: Reserve) => !(new Date(r.from) > new Date(fromTo.to as string) || new Date(r.to) < new Date(fromTo.from as string)))
            const filteredRes = reserves.filter((r: any) => (new Date(r.from) >= new Date(fromTo.from as string) && new Date(r.to) <= new Date(fromTo.to as string) ))
            // console.log("cringe: ", filteredRes)
            dispatch(setReserves({ reserveData: filteredRes }))
        }
        if (!create)
            setReservess()
    }, [roomId, fromTo])

    const session = useSession()
    let username: string | null | undefined = null

    if (session.data! !== undefined)
        username = session.data!.user!.name


    const handleSave = async () => {
        const newRoom = {
            ...room,
            xSize:xCells,
            ySize:yCells,
            gridPoints: grid?.flat()
        }

        await axios.put("/api/room/", { ...newRoom, id: roomId })
        try {
            await axios.delete(`/api/seats/${roomId}`)
            if (seats.length > 0) {
                await axios.post("/api/seats/", { seats })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleOptionChange = (element: any) => {
        if (!selectedCell) return;

        const newGrid: GridPoint[][] = grid?.length ? grid.map((row) =>
            row.map((cell) => {
                if (cell.x === selectedCell.x && cell.y === selectedCell.y) {
                    var seatName: string | null = null
                    if (element === "chair") {
                        seatName = `${room?.name}-${cell.x}-${cell.y}`
                        const newSeat = { name: seatName, type: "", roomId: roomId }
                        if (seats && !seats.find((seat: any) => seat.name === seatName))
                            setSeats([...seats, newSeat])
                    } else {
                        const seatToDelete = `${room?.name}-${cell.x}-${cell.y}`
                        if (seats.find((seat: any) => seat.name === seatToDelete)) {
                            setSeats(seats.filter((seat: any) => seat.name !== seatToDelete))
                        }
                    }
                    return { ...cell, info: element, seatName: seatName }
                }
                return cell;
            })
        ) : [];
        setGrid(newGrid);
        setUpdateGrid(newGrid.flat())
    };


    return (
        <>
            {create ? (
                <>
                <GridOptions
                    xCells={xCells}
                    setXCells={setXCells}
                    yCells={yCells}
                    setYCells={setYCells}
                    handleSave={handleSave}
                />
                <div className="room-creation">
                    <div className="room-grid">
                        {selectedCell && (
                            <AnimatePresence>
                                {showOptions && (
                                    <motion.aside
                                        variants={variants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        key="aside"
                                        className="creation-options__aside"
                                        ref={optionRef}
                                    >
                                        <div className="creation-options__box">
                                            <OptionsBar
                                                selectedCell={selectedCell}
                                                handleOptionChange={handleOptionChange}
                                            />
                                        </div>
                                    </motion.aside>
                                )}
                            </AnimatePresence>
                        )}
                        <GridCreate
                            fromTo={fromTo}
                            setSeatName={setSeatName}
                            setAction={setAction}
                            roomId={roomId}
                            setRoom={setRoom}
                            room={room}
                            xSize={xCells}
                            ySize={yCells}
                            grid={grid}
                            setGrid={setGrid}
                            seats={seats}
                            setSeats={setSeats}
                            setSelectedCell={setSelectedCell}
                            selectedCell={selectedCell}
                            setShowOptions={setShowOptions}
                            optionRef={optionRef}
                            updateGrid={updateGrid}
                            setUpdateGrid={setUpdateGrid}
                        />
                    </div>
                </div>
                </>
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