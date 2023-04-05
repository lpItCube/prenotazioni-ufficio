import { useEffect, useRef } from "react"
import { GridPoint, Room, CurrentCell } from "../../types";
import CellContent from "./CellContent";
import _ from "lodash"

interface GridCreateProps {
  fromTo: any,
  setSeatName: any,
  setAction: any,
  roomId: string,
  setRoom: any,
  room: Room | any,
  xSize: number,
  ySize: number,
  grid?:GridPoint[][],
  setGrid: (newGrid:GridPoint[][]) => void,
  seats?:any,
  setSeats: (seats:any[]) => void,
  setSelectedCell: (point:any) => void,
  selectedCell:GridPoint | null,
  setShowOptions: (bool:boolean) => void,
  optionRef?:any,
  updateGrid: any,
  setUpdateGrid:(upd:any) => void
}

function GridCreate(props: GridCreateProps) {



  const isometricRef = useRef<any>(null)
  const cellRef = useRef<any>(null)

  const { 
    setSeatName, 
    setAction,
    roomId, 
    room, 
    xSize, 
    ySize, 
    grid, 
    setGrid, 
    setSeats,
    setSelectedCell,
    selectedCell,
    setShowOptions,
    optionRef,
    updateGrid,
    setUpdateGrid
  } = props



  useEffect(() => {
    // UseRef per controllare se il click è interno

    const handleClickOutside = (event: any) => {

      if (cellRef.current && !cellRef.current.contains(event.target) && optionRef.current && !optionRef.current.contains(event.target) /*&& optionRef.current && !optionRef.current.contains(event.target)*/) {
        setSelectedCell({x:-1,y:-1,info:null})
      }

    };
    window.addEventListener('click', handleClickOutside, true);
    return () => {
      window.removeEventListener('click', handleClickOutside, true);
    };
  }, [])


  useEffect(() => {
    if(room) {
      setUpdateGrid(room.gridPoints && room.gridPoints.length > 0 ? room.gridPoints : [])
      if(room.seat && room.seat.length > 0) {
        const omitSeats = _.map(room.seat, (obj) =>  {
          return _.omit(obj, ['reserve','id']);
        });
        setSeats(omitSeats)
      } else {
        setSeats([{ name: `${room.name}-whole`, type: "whole", roomId: roomId }])
      }
    }
  }, [room])



  useEffect(() => {
    const newGrid: GridPoint[][] = [];
    if(updateGrid) {
      for (let y = 0; y < ySize; y++) {
        const row: GridPoint[] = [];
        for (let x = 0; x < xSize; x++) {
          const point = updateGrid.find((p: any) => p.x === x && p.y === y);
          row.push(point || { x, y, info: "" } as GridPoint);
        }
        newGrid.push(row);
      }
    }
    setGrid(newGrid);

  }, [xSize, ySize, updateGrid]);

  useEffect(() => {
    function returnElement(findX:number, findY:number):any {
      const element:any = grid?.flat().find((el:any) => el.x === findX && el.y === findY);
      return element
    }
    function handleKeyUp(event:any) {
      if(selectedCell && selectedCell.x !== -1 && selectedCell.y !== -1) {
        if (event.keyCode === 37) {
          setSelectedCell((prev:any) => ({
            ...prev,
            x:prev.x !== 0 ? prev.x-1 : 0,
            info:returnElement(prev.x !== 0 ? prev.x-1 : 0,prev.y).info,
            seatName:returnElement(prev.x !== 0 ? prev.x-1 : 0,prev.y).seatName,
          }))
        }
        if (event.keyCode === 38) {
          setSelectedCell((prev:any) => ({
            ...prev,
            y:prev.y !== 0 ? prev.y-1 : 0,
            info:returnElement(prev.x,prev.y !== 0 ? prev.y-1 : 0).info,
            seatName:returnElement(prev.x,prev.y !== 0 ? prev.y-1 : 0).seatName,
          }))
        }
        if (event.keyCode === 39) {
          setSelectedCell((prev:any) => ({
            ...prev,
            x:prev.x !== xSize-1 ? prev.x+1 : xSize-1,
            info:returnElement(prev.x !== xSize-1 ? prev.x+1 : xSize-1,prev.y).info,
            seatName:returnElement(prev.x !== xSize-1 ? prev.x+1 : xSize-1,prev.y).seatName,
          }))
        }
        if (event.keyCode === 40) {
          setSelectedCell((prev:any) => ({
            ...prev,
            y:prev.y !== ySize-1 ? prev.y+1 : ySize-1,
            info:returnElement(prev.x,prev.y !== ySize-1 ? prev.y+1 : ySize-1).info,
            seatName:returnElement(prev.x,prev.y !== ySize-1 ? prev.y+1 : ySize-1).seatName,
          }))
        }
      }
    }

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [selectedCell]);


  const handleCellClick = (event: any, point: GridPoint) => {

    setSelectedCell({x:point.x,y:point.y,info:point.info,seatName:point.seatName})
    // setSelectedCell(point)
    setShowOptions(true)
    if(grid?.length) {
      setUpdateGrid(grid.flat())
    }
  };



  

  return (
    <>
      <div className="creation-table__wrapper" ref={isometricRef}>
        <div className="creation-table__body" id="isometric-container" style={{ width: xSize * 50 + 'px' }}>
          {grid?.map((row, rowIndex) => (
            <div className="creation-table__row" key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <div
                  ref={cellRef}
                  className={`creation-table__col${cell.x === selectedCell?.x && cell.y === selectedCell?.y ? ' selected' : ''}`}
                  key={columnIndex}
                  onClick={(e) => handleCellClick(e, cell)}
                >
                  <CellContent create={true} setSeatName={setSeatName} setAction={setAction} cell={cell} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default GridCreate