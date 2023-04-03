import { useState, useEffect, useRef } from "react"
import { GridPoint, Seat, Room } from "../../types";
import CellContent from "./CellContent";
import axios from "axios";
import _ from "lodash"

interface GridCreateProps {
  fromTo: any,
  setSeatName: any,
  setAction: any,
  roomId: string,
  setRoom: any,
  room: Room | any,
  xSize: number,
  ySize: number
}

function GridCreate({ setSeatName, setAction, roomId, setRoom, room, xSize, ySize }: GridCreateProps) {

  const isometricRef = useRef<any>(null)
  const optionRef = useRef<any>(null)

  const { gridPoints, seat } = room;

  // console.log('ROOM',room)

  const [grid, setGrid] = useState<GridPoint[][]>([]);
  const [seats, setSeats] = useState<any[]>([])
  const [selectedCell, setSelectedCell] = useState<GridPoint | null>(null)
  const [updateGrid, setUpdateGrid] = useState<any>([])
  const [showOptions, setShowOptions] = useState<boolean>(false)

  useEffect(() => {
    // UseRef per controllare se il click è interno

    const handleClickOutside = (event: any) => {
      if (isometricRef.current && !isometricRef.current.contains(event.target)) {
        setShowOptions(false)
      }
      if (optionRef.current && optionRef.current.contains(event.target)) {
        setShowOptions(true)
      }
    };
    window.addEventListener('click', handleClickOutside, true);
    return () => {
      window.removeEventListener('click', handleClickOutside, true);
    };
  }, [])


  // WARNING !! Do not invert useEffect order
  useEffect(() => {
    // setUpdateGrid(grid.flat())
    console.log('CHANGE SEATS')
  }, [seats])

  useEffect(() => {
    setUpdateGrid(gridPoints)
    if(seat && seat.length > 0) {
      const omitSeats = _.map(seat, (obj) =>  {
        return _.omit(obj, ['reserve','id']);
      });
      setSeats(omitSeats)
    } else {
      setSeats([{ name: `${room.name}-whole`, type: "whole", roomId: roomId }])
    }
  }, [])


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

  }, [xSize, ySize, updateGrid]);


  const handleCellClick = (event: any, point: GridPoint) => {
    setSelectedCell(point)
    setShowOptions(true)
    setUpdateGrid(grid.flat())
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('NOW',seats)
    if (!selectedCell) return;
    const newGrid = grid.map((row) =>
      row.map((cell) => {
        if (cell.x === selectedCell.x && cell.y === selectedCell.y) {
          console.log('SAVE PASS 1')
          var seatName: string | null = null
          if (e.target.value === "hChair" || e.target.value === "vChair") {
            console.log('SAVE DATA', seats)
            seatName = `${room.name}-${cell.x}-${cell.y}`
            const newSeat = { name: seatName, type: "", roomId: roomId }
            if (seats && !seats.find((seat) => seat.name === seatName))
              console.log('SAVE SEATS',[...seats, newSeat])
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
    setUpdateGrid(newGrid.flat())
  };

  const handleSave = async () => {
    const newRoom = {
      ...room,
      xSize,
      ySize,
      gridPoints: grid.flat()
    }

    const putResponse = await axios.put("/api/room/", { ...newRoom, id: roomId })
    try {
      const deleteSeats = await axios.delete(`/api/seats/${roomId}`)
      if (seats.length > 0) {
        console.log('REAL SAVE',room)
        const create = await axios.post("/api/seats/", { seats })
      }
    } catch (e) {
      console.log(e)
    }
  }

  // console.log('SELECTED',updateGrid)

  return (
    <>
      {selectedCell && showOptions &&
        <div
          ref={optionRef}
          className="creation-options__wrapper"
        >
          <div className="creation-options__element">
            <div className="creation-options__seat"></div>
          </div>
          <div className="creation-options__element">
            <div className="creation-options__table--vertical"></div>
          </div>
          <div className="creation-options__element">
            <div className="creation-options__table--horizontal"></div>
          </div>
          <div className="creation-options__element">
            <div className="creation-options__table--angle-tr"></div>
          </div>
          <div className="creation-options__element">
            <div className="creation-options__table--angle-tl"></div>
          </div>
          <div className="creation-options__element">
            <div className="creation-options__table--angle-br"></div>
          </div>
          <div className="creation-options__element">
            <div className="creation-options__table--angle-bl"></div>
          </div>
        </div>
      } 
      <div className="creation-table__wrapper" ref={isometricRef}>
        {/* <tbody>
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
        </tbody> */}
        <div className="creation-table__body" id="isometric-container" style={{ width: xSize * 50 + 'px' }}>

          {grid.map((row, rowIndex) => (
            <div className="creation-table__row" key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <div
                  className="creation-table__col"
                  key={columnIndex}
                  onClick={(e) => handleCellClick(e, cell)}
                // style={{ height: "50px", width: "50px" }}
                >
                  {selectedCell === cell ? (
                    <select value={cell.info} onChange={handleOptionChange}>
                      <option>---</option>
                      <option value="hChair" style={{ backgroundImage: "url('/table.svg')" }}>hChair</option>
                      <option value="vChair" style={{ backgroundImage: "url('/table.svg')" }}>vChair</option>
                      <option value="vLine" style={{ backgroundImage: "url('/chair.svg')" }}>vLine</option>
                      <option value="hLine" style={{ backgroundImage: "url('/chair.svg')" }}>hLine</option>
                      <option value="quarter-circle-top-left" style={{ backgroundImage: "url('/chair.svg')" }}>tLeft</option>
                      <option value="quarter-circle-top-right" style={{ backgroundImage: "url('/chair.svg')" }}>tRight</option>
                      <option value="quarter-circle-bottom-left" style={{ backgroundImage: "url('/chair.svg')" }}>bLeft</option>
                      <option value="quarter-circle-bottom-right" style={{ backgroundImage: "url('/chair.svg')" }}>bRight</option>
                    </select>
                  ) : (
                    <CellContent create={true} setSeatName={setSeatName} setAction={setAction} cell={cell} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSave}>Save</button>
    </>
  )
}

export default GridCreate