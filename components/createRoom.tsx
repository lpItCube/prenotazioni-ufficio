import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { RiContactsBookLine } from "react-icons/ri"
import { useSelector, useDispatch } from "react-redux"
import { getModalStatus, setModalType, toggleModal } from "../features/modalSlice"
import { setReserves } from "../features/reserveSlice"
import Modal from "./modal"

// id           String @id @default(uuid())
// user         User   @relation(fields: [userId], references: [id])
// userId       String
// seat         Seat   @relation(fields: [seatId], references: [id])
// seatId       String
// reservedDays String[]
// from         DateTime 
// to           DateTime
// status       String?

type Reserve = {
  id: string,
  user: any
  userId: string,
  seat: Seat,
  seatId: string,
  from: Date,
  to: Date,
  status: string
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

function CreateRoom({fromTo, action, setAction, roomId}: any) {
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
      <div className="room-creation">
        <input id="inputX" type="number"></input>
        <input id="inputY" type="number"></input>
        <button onClick={() => {handleXY()}}>Submit Input</button>
        <div className="room-grid">
          {(room && room.xSize && room.ySize) ? <Grid fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} roomId={roomId} setRoom={setRoom} room={room}/> 
          : xYSizes && <Grid fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} roomId={roomId} setRoom={setRoom} room={{ xSize: xYSizes.x, ySize: xYSizes.y, gridPoints: [], name: room!.name }} />}
        </div>
      </div>
      <Modal
          seatName={seatName}
          action={action}
          username={username}
          fromTo={fromTo}
        />
    </>
  )
}

function Grid({ fromTo, setSeatName, setAction, roomId, setRoom, room }: { fromTo:any, setSeatName: any, setAction: any, roomId: string, setRoom: any, room: Room|any }) {
  const { xSize, ySize, gridPoints } = room;
  const [grid, setGrid] = useState<GridPoint[][]>([]);
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedOption, setSelectedOption] = useState<"table" | "chair">("table");
  const [selectedCell, setSelectedCell] = useState<GridPoint | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    console.log(seats)
    const newRoom = {...room, gridPoints: grid.flat()}
    const res = await axios.put("/api/room/", {...newRoom, id: roomId})
    console.log("update -> ", res)
    if (seats.length > 0) {
      try {
        await axios.delete(`/api/seats/${roomId}`)
        const res2 = await axios.post("/api/seats/", {seats})
        console.log("update2 -> ", res2)
      } catch (e) {
        console.log(e)
      }
    }
  };

  return (
    <>
    <table style={{ width: "auto" }}>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <td
                key={columnIndex}
                onClick={() => handleCellClick(cell)}
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
                  <CellContent fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} cell={cell} />
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

const CellContent = ({ fromTo, reserves, setSeatName, setAction, cell }: any) => {
  if (cell.info === "hChair") {
    return (
      <div style={{ position: "relative", textAlign: "center" }}>
        <hr style={{ position: "absolute", top: "22px", left: "0", width: "100%" }} />
        <Seat fromTo={fromTo} reserves={reserves} setSeatName={setSeatName} setAction={setAction} cell={cell} /> 
      </div>
    );
  } else if (cell.info === "vChair") {
    return (
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ position: "relative", alignItems: "center", justifyContent:"center", height: "100%" }}>
          <div style={{ position: "absolute", left: "24px", height: "100%", borderLeft: "1px solid grey" }}></div>
          <Seat fromTo={fromTo} reserves={reserves} setSeatName={setSeatName} setAction={setAction} cell={cell} /> 
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
};

function Seat({fromTo, setSeatName, setAction, cell}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reserves, setReserves] = useState<Reserve[]>([])
  const [canvasClass, setCanvasClass] = useState("")

  const session = useSession()
  let username: string|null|undefined = null

  if (session.data! !== undefined)
    username = session.data!.user!.name

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
    console.log(reserves[0])
    // const yourReserve = reserves[0].user.username === username
    // const free = reserves.length === 0

    // var canvClass = ""
    // if (yourReserve || free)
    //   canvClass.concat("clickable")
    

    // setCanvasClass(canvClass)
  }, [reserves])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCanvas(canvas)
  }, [canvasClass])

  useEffect(() => {
    const getReserves = async() => {
      if (username != null && username != undefined) {
        console.log(cell.seatName)
        const res = await (await axios.get(`/api/seatReserves/${cell.seatName}`)).data
        // const filteredRes = res.filter((r: any) => r.seat.name === cell.seatName)
        const filteredRes = res.filter((r:any) => 
          !(new Date(r.from) > new Date(fromTo.to as string) || new Date(r.to) < new Date(fromTo.from as string)
        ))
        setReserves(filteredRes)
        console.log(res)
        console.log(filteredRes)
        const canvas = canvasRef.current;
        if (!canvas) return;
        drawCanvas(canvas)
      }
    }
    getReserves()
  }, [fromTo])

  function drawCanvas(canvas: any) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    var xPos = (canvas.width / 2) - (20 / 2);
    var yPos = (canvas.height / 2) - (20 / 2);
    ctx.roundRect(xPos, yPos, 20, 20, 5);
    if (reserves.length > 0)
      ctx.fillStyle = "red";
    else
      ctx.fillStyle = "orange";
    ctx.fill();
    ctx.stroke();
  }

  return (
    <canvas onClick={() => {setSeatName(cell.seatName); handleAddSingleSeat()}} className={canvasClass} style={{ position: "relative", zIndex: "1" }} ref={canvasRef} width={40} height={40} />
  )
}

export default CreateRoom