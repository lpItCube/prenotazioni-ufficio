import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { RiContactsBookLine } from "react-icons/ri"
import { useSelector, useDispatch } from "react-redux"
import { getModalStatus, setModalType, toggleModal } from "../features/modalSlice"
import { setReserves } from "../features/reserveSlice"
import Modal from "./modal"

type Reserve = {
  id: string,
  user: User
  userId: string,
  seat: Seat,
  seatId: string,
  from: Date,
  to: Date,
  status: string
}

type User = {
  id: string,
  username: string
}

type Room = {
  id: string,
  name: string,
  gridPoints: GridPoint[],
  xSize: number,
  ySize: number
}

type GridPoint = {
  x: number,
  y: number,
  info: string
}

type XYSizes = {
  x: number,
  y: number
}

type Seat = {
  name: string
  type: string
  roomId: string
}

function HandleRoom({fromTo, action, setAction, roomId, create}: any) {
  const [room, setRoom] = useState<Room|undefined>(undefined)
  const [xYSizes, setxYSizes] = useState<XYSizes|undefined>(undefined)
  const [seatName, setSeatName] = useState("none")

  const session = useSession()
  let username: string|null|undefined = null

  if (session.data! !== undefined)
    username = session.data!.user!.name
  
  useEffect(() => {
    const getRoom = async() => {
      const res = await axios.get(`/api/room/${roomId}`)
      if(res)
        setRoom(res.data)
    }
    getRoom()
  }, [])

  const handleXY = () => {
    const x = (document.getElementById("inputX") as HTMLInputElement).value
    const y = (document.getElementById("inputY") as HTMLInputElement).value
    setxYSizes({x: parseInt(x), y: parseInt(y)})
  }

  return (
    <>
      {create ? (
        <div className="room-creation">
          <input id="inputX" type="number"></input>
          <input id="inputY" type="number"></input>
          <button onClick={() => {handleXY()}}>Submit Input</button>
          <div className="room-grid">
            {xYSizes && <GridCreate create={create} fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} roomId={roomId} setRoom={setRoom} room={{ xSize: xYSizes.x, ySize: xYSizes.y, gridPoints: [], name: room!.name }} />}
          </div>
        </div>
        ) : (
          <>
          <div className="room-creation">
            <div className="room-grid">
              {(room && room.xSize && room.ySize) && <Grid create={create} fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} roomId={roomId} setRoom={setRoom} room={room}/>}
            </div>
          </div>
          <Modal seatName={seatName} action={action} username={username} fromTo={fromTo}/>
          </>
        )
      }
    </>
  )
}

function Grid({create, fromTo, setSeatName, setAction, roomId, setRoom, room} : any) {
  const { xSize, ySize, gridPoints } = room;
  const [grid, setGrid] = useState<GridPoint[][]>([])
  const [reserves, setReserves] = useState<Reserve[]|undefined>(undefined)

  useEffect(() => {
    const getRoomReserves = async () => {
      //TODO: ADD LOADING MODAL
      const res = await (await axios.get(`/api/roomReserves/${roomId}`)).data
      const filteredRes = res.filter((r: Reserve) => 
          !(new Date(r.from) > new Date(fromTo.to as string) || new Date(r.to) < new Date(fromTo.from as string)
        ))
      setReserves(filteredRes)
    }
    getRoomReserves()
  }, [fromTo])

  useEffect(() => {
    const newGrid: GridPoint[][] = [];
    for (let y = 0; y < ySize; y++) {
      const row: GridPoint[] = [];
      for (let x = 0; x < xSize; x++) {
        const point = gridPoints.find((p: any) => p.x === x && p.y === y);
        row.push(point || { x, y, info: "" } as GridPoint);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, [xSize, ySize, gridPoints]);

  return (
    <>
    <table style={{ width: "auto" }}>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <td
                key={columnIndex}
                style={{ height: "50px", width: "50px" }}
              >      
                <CellContent reserves={reserves} fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )

}

function GridCreate({ create, fromTo, setSeatName, setAction, roomId, setRoom, room }: { create: boolean, fromTo:any, setSeatName: any, setAction: any, roomId: string, setRoom: any, room: Room|any }) {
  const { xSize, ySize, gridPoints } = room;
  const [grid, setGrid] = useState<GridPoint[][]>([]);
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedCell, setSelectedCell] = useState<GridPoint | null>(null)
  const [reserves, setReserves] = useState<Reserve[]|[]>([])

  // useEffect(() => {
  //   const getRoomReserves = async () => {
  //     //TODO: ADD LOADING MODAL
  //     const res = await (await axios.get(`/api/roomReserves/${roomId}`)).data
  //     const filteredRes = res.filter((r: Reserve) => 
  //         !(new Date(r.from) > new Date(fromTo.to as string) || new Date(r.to) < new Date(fromTo.from as string)
  //       ))
  //     setReserves(filteredRes)
  //   }
  //   getRoomReserves()
  // }, [fromTo])

  useEffect(() => {
    const newGrid: GridPoint[][] = [];
    for (let y = 0; y < ySize; y++) {
      const row: GridPoint[] = [];
      for (let x = 0; x < xSize; x++) {
        const point = gridPoints.find((p: any) => p.x === x && p.y === y);
        row.push(point || { x, y, info: "" } as GridPoint);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, [xSize, ySize, gridPoints]);

  const handleCellClick = (point: GridPoint) => setSelectedCell(point);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedCell) return;
    const newGrid = grid.map((row) =>
    row.map((cell) => {
      if (cell.x === selectedCell.x && cell.y === selectedCell.y) {
          var seatName: string|null = null
          if (e.target.value === "hChair" || e.target.value === "vChair") {
            seatName = `${room.name}-${cell.x}-${cell.y}`
            const newSeat = {name: seatName, type: "", roomId: roomId}
            if (!seats.find((seat) => seat.name === seatName))
              setSeats([...seats, newSeat])
          } else {
            const seatToDelete = `${room.name}-${cell.x}-${cell.y}`
            if (seats.find((seat) => seat.name === seatToDelete)) {
              setSeats(seats.filter((seat) => seat.name !== seatToDelete))
            }
          }
          return { ...cell, info: e.target.value, seatName: seatName }
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const handleSave = async() => {
    const newRoom = {...room, gridPoints: grid.flat()}
    await axios.put("/api/room/", {...newRoom, id: roomId})
    if (seats.length > 0) {
      try {
        await axios.delete(`/api/seats/${roomId}`)
        await axios.post("/api/seats/", {seats})
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <>
    <table style={{ width: "auto" }}>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <td
                key={columnIndex}
                onClick={ create ? () => handleCellClick(cell) : () => {} }
                style={{ height: "50px", width: "50px" }}
              >
                {selectedCell === cell ? (
                  <select value={cell.info} onChange={handleOptionChange}>
                    <option>---</option>
                    <option value="hChair" style={{backgroundImage: "url('/table.svg')"}}>hChair</option>
                    <option value="vChair" style={{backgroundImage: "url('/table.svg')"}}>vChair</option>
                    <option value="vLine" style={{backgroundImage: "url('/chair.svg')"}}>vLine</option>
                    <option value="hLine" style={{backgroundImage: "url('/chair.svg')"}}>hLine</option>
                    <option value="quarter-circle-top-left" style={{backgroundImage: "url('/chair.svg')"}}>tLeft</option>
                    <option value="quarter-circle-top-right" style={{backgroundImage: "url('/chair.svg')"}}>tRight</option>
                    <option value="quarter-circle-bottom-left" style={{backgroundImage: "url('/chair.svg')"}}>bLeft</option>
                    <option value="quarter-circle-bottom-right" style={{backgroundImage: "url('/chair.svg')"}}>bRight</option>
                  </select>
                ) : (
                  <CellContent reserves={reserves} fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} cell={cell} />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={handleSave}>Save</button>
    </>
  )
}

const CellContent = ({ reserves, fromTo, setSeatName, setAction, cell }: any) => {
  if (cell.info === "hChair") {
    return (
      <div style={{ position: "relative", textAlign: "center" }}>
        <hr style={{ position: "absolute", top: "22px", left: "0", width: "100%" }} />
        { 
        reserves && 
          <Seat reserves={reserves} fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} cell={cell} />
        }
      </div>
    );
  } else if (cell.info === "vChair") {
    return (
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ position: "relative", alignItems: "center", justifyContent:"center", height: "100%" }}>
          <div style={{ position: "absolute", left: "24px", height: "100%", borderLeft: "1px solid grey" }}></div>
          { 
          reserves &&
            <Seat reserves={reserves} fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} cell={cell} />
          }
        </div>
      </div>
    );
  } else if(cell.info === "vLine") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent:"center", height: "100%" }}>
        <div style={{ height: "100%", borderLeft: "1px solid grey" }}></div>
      </div>
    );
  } else if(cell.info === "hLine") {
    return (
      <hr style={{  width: "100%" }} />
    );
  } else if(
      cell.info === "quarter-circle-top-left" || 
      cell.info === "quarter-circle-top-right" ||
      cell.info === "quarter-circle-bottom-left" ||
      cell.info === "quarter-circle-bottom-right"
    ) {
    return (
      <div className={"box-"+cell.info} style={{ display: "flex", height: "100%" }}>
        <div className={cell.info}></div>
      </div>
    );
  }
    else return <div></div>
}

type SeatProps = {
  color: string,
  canvasClass: string
}

function Seat({reserves, fromTo, setSeatName, setAction, cell}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seatProps, setSeatProps] = useState<SeatProps>({color: "green", canvasClass: ""})

  const session = useSession()
  let username: string|null|undefined = null
  let role: string|null|undefined = null

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
    const yourReserveInRoom = reserves.find((r: Reserve) => r.user.username === username)
    const seatReserves = reserves.filter((r: Reserve) => r.seat.name === cell.seatName)
    const isAdmin = role === "ADMIN"

    console.log(reserves)

    var canvasClass = ""
    var color = ""

    const yourReserve = yourReserveInRoom && yourReserveInRoom.id === seatReserves[0].id
    if (yourReserve)
      setSeatProps({color: "yellow", canvasClass: "clickable del"})
    else if (yourReserveInRoom && !isAdmin) setSeatProps({color: "grey", canvasClass: ""})
  
    else {
      const free = seatReserves.length === 0
      const color = free ? "green" : "red"
      const canvasClass = free ? "clickable" : isAdmin ? "clickable del" : ""
      setSeatProps({color: color, canvasClass: canvasClass})
    }
    
  }, [reserves])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCanvas(canvas)
  }, [seatProps])

  function drawCanvas(canvas: any) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    var xPos = (canvas.width / 2) - (20 / 2);
    var yPos = (canvas.height / 2) - (20 / 2);
    ctx.roundRect(xPos, yPos, 20, 20, 5);
    ctx.fillStyle = seatProps.color
    ctx.fill();
    ctx.stroke();
  }

  return (
    <canvas 
      onClick={ 
        seatProps.canvasClass === "clickable" ? 
        () => { setSeatName(cell.seatName); handleAddSingleSeat() } :
        seatProps.canvasClass === "clickable del" ? 
        () => { setSeatName(cell.seatName); handleDeleteSingleSeat() } : () => {}} 
      className={seatProps.canvasClass} 
      style={{ position: "relative", zIndex: "1" }} 
      ref={canvasRef} width={40} height={40} />
  )
}

export default HandleRoom