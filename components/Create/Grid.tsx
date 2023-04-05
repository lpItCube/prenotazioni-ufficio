import { useState, useEffect } from "react"
import { GridPoint } from "../../types";
import CellContent from "./CellContent";

function Grid({ fromTo, setSeatName, setAction, room }: any) {
    const { xSize, ySize, gridPoints } = room;
    const [grid, setGrid] = useState<GridPoint[][]>([])

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
        <div className="creation-table__wrapper">
            <div className="creation-table__body" id="isometric-container" style={{ width: xSize * 50 + 'px' }}>
            {grid?.map((row, rowIndex) => (
            <div className="creation-table__row" key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <div
                  className={`creation-table__col`}
                  key={columnIndex}
                >
                  <CellContent fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} cell={cell} />
                </div>
              ))}
            </div>
          ))}
            </div>
        </div>
        </>
    )
}

export default Grid