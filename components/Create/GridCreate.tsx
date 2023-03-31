import { useState, useEffect } from "react"
import { GridPoint, Seat, Room } from "../../types";
import CellContent from "./CellContent";
import axios from "axios";

interface GridCreateProps {
  fromTo:any, 
  setSeatName: any, 
  setAction: any, 
  roomId: string, 
  setRoom: any, 
  room: Room|any,
  xSize: number,
  ySize: number
}

function GridCreate({ setSeatName, setAction, roomId, setRoom, room, xSize, ySize }: GridCreateProps) {

  // Ogni volta che faccio una modifica ad un posto devo eseguire una put
  // Ogni volta che ho finito di eseguire la put devo eseguire la get
  
  const { gridPoints } = room;

  const [grid, setGrid] = useState<GridPoint[][]>([]);
  const [seats, setSeats] = useState<Seat[]>([{name: `${room.name}-whole`, type: "whole", roomId: roomId}])
  const [selectedCell, setSelectedCell] = useState<GridPoint | null>(null)
  const [updateGrid, setUpdateGrid] = useState<any>([])

  
  // WARNING !! Do not invert useEffect order
  useEffect(() => {
    setUpdateGrid(grid.flat())
  }, [seats])
  
  useEffect(() => {
    setUpdateGrid(gridPoints)
  },[gridPoints])


    useEffect(() => {
      const newGrid: GridPoint[][] = [];
      for (let y = 0; y < ySize; y++) {
        const row: GridPoint[] = [];
        for (let x = 0; x < xSize; x++) {
          const point = updateGrid.find((p: any) => p.x === x && p.y === y);
          row.push(point || { x, y, info: "" } as GridPoint);
        }
        newGrid.push(row);
      }
      setGrid(newGrid);

      console.log('NOW WORK',newGrid.flat())

    }, [xSize, ySize, updateGrid]);
  

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
      const newRoom = {
        ...room,
        xSize,
        ySize,
        gridPoints: grid.flat()
      }
      console.log('NEW ROOM',seats,grid.flat())
      const putResponse = await axios.put("/api/room/", {...newRoom, id: roomId})
      console.log('PUT ROOM',xSize) // GESTIRE QUI X E Y
      try {
        await axios.delete(`/api/seats/${roomId}`)
        if (seats.length > 0)
          await axios.post("/api/seats/", {seats})
      } catch (e) {
        console.log(e)
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
                    <CellContent create={true} setSeatName={setSeatName} setAction={setAction} cell={cell} />
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

export default GridCreate