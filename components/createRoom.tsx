import axios from "axios"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { RiContactsBookLine } from "react-icons/ri"

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

function CreateRoom({roomId}: any) {
  const [room, setRoom] = useState<Room|undefined>(undefined)
  const [xYSizes, setxYSizes] = useState<XYSizes|undefined>(undefined)
  
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
    <div className="room-creation">
      <input id="inputX" type="number"></input>
      <input id="inputY" type="number"></input>
      <button onClick={() => {handleXY()}}>Submit Input</button>
      <div className="room-grid">
        {(room && room.xSize && room.ySize) ? <Grid roomId={roomId} setRoom={setRoom} room={room}/> 
        : xYSizes && <Grid roomId={roomId} setRoom={setRoom} room={{ xSize: xYSizes.x, ySize: xYSizes.y, gridPoints: [] }} />}
      </div>
    </div>
  )
}

function Grid({ roomId, setRoom, room }: { roomId: string, setRoom: any, room: Room|any }) {
  const { xSize, ySize, gridPoints } = room;
  const [grid, setGrid] = useState<GridPoint[][]>([]);
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
          return { ...cell, info: e.target.value };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const handleSave = async() => {
    const newRoom = {...room, gridPoints: grid.flat()}
    const res = await axios.put("/api/room/", {...newRoom, id: roomId})
    console.log("update -> ", res)
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
                style={{ height: "50px", width: "50px"}}
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
                  <CellContent cell={cell} />
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

const CellContent = ({ cell }: any) => {
  if (cell.info === "hChair") {
    return (
      <div style={{ position: "relative", textAlign: "center" }}>
        <hr style={{ position: "absolute", top: "22px", left: "0", width: "100%" }} />
        <Canvas /> 
      </div>
    );
  } else if (cell.info === "vChair") {
    return (
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ position: "relative", alignItems: "center", justifyContent:"center", height: "100%" }}>
          <div style={{ position: "absolute", left: "24px", height: "100%", borderLeft: "1px solid grey" }}></div>
          <Canvas /> 
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

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCanvas(canvas)
  }, []);

  function drawCanvas(canvas: any) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    var xPos = (canvas.width / 2) - (20 / 2);
    var yPos = (canvas.height / 2) - (20 / 2);
    ctx.roundRect(xPos, yPos, 20, 20, 5);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.stroke();
  }
  return (
    <canvas style={{ position: "relative", zIndex: "1" }} ref={canvasRef} width={40} height={40} />
  )
}

export default CreateRoom