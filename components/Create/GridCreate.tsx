import { useEffect, useRef } from "react"

// Types
import { GridPoint, Room, Seat } from "../../types";

// Components
import CellContent from "./CellContent";

// Lodash
import _ from "lodash"

interface GridCreateProps {
	setSeatName: (seatName: string) => void,
	setAction: (action: number) => void,
	roomId: string,
	setRoom: any,
	room?: Room,
	xSize: number,
	ySize: number,
	grid?: GridPoint[][],
	setGrid: (newGrid: GridPoint[][]) => void,
	setSeats: (seats: Seat[]) => void,
	setSelectedCell: (point: any) => void,
	selectedCell?: GridPoint,
	setShowOptions: (bool: boolean) => void,
	optionRef?: any,
	updateGrid: GridPoint[],
	setUpdateGrid: (upd: GridPoint[] | []) => void
}

const GridCreate: React.FC<GridCreateProps> = (props): JSX.Element => {

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


	const cellRef = useRef<any>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (cellRef.current && !cellRef.current.contains(event.target) && optionRef.current && !optionRef.current.contains(event.target) /*&& optionRef.current && !optionRef.current.contains(event.target)*/) {
				setSelectedCell({ x: -1, y: -1, info: '' })
			}
		};
		window.addEventListener('click', handleClickOutside, true);
		return () => {
			window.removeEventListener('click', handleClickOutside, true);
		};
	}, [])


	useEffect(() => {
		if (room) {
			setUpdateGrid(room.gridPoints && room.gridPoints.length > 0 ? room.gridPoints : [])
			if (room?.seat && room?.seat?.length > 0) {
				const omitSeats = _.map(room.seat, (obj) => {
					return _.omit(obj, ['reserve', 'id']);
				});
				setSeats(omitSeats)
			} else {
				setSeats([{ name: `${room.name}-whole`, type: "whole", roomId: roomId }])
			}
		}
	}, [room])



	useEffect(() => {
		const newGrid: GridPoint[][] = [];
		if (updateGrid) {
			for (let y = 0; y < ySize; y++) {
				const row: GridPoint[] = [];
				for (let x = 0; x < xSize; x++) {
					const point = updateGrid.find((p: GridPoint) => p.x === x && p.y === y);
					row.push(point || { x, y, info: "" } as GridPoint);
				}
				newGrid.push(row);
			}
		}
		setGrid(newGrid);

	}, [xSize, ySize, updateGrid]);


	useEffect(() => {
		const returnElement = (findX: number, findY: number): GridPoint | undefined => {
			const element: GridPoint | undefined = grid?.flat().find((el: any) => el.x === findX && el.y === findY);
			return element
		}
		function handleKeyUp(event: KeyboardEvent) {
			if (selectedCell && selectedCell.x !== -1 && selectedCell.y !== -1) {
				if (event.key === 'ArrowLeft') {
					setSelectedCell((prev:GridPoint) => ({
						...prev,
						x: prev.x !== 0 ? prev.x - 1 : 0,
						info: returnElement(prev.x !== 0 ? prev.x - 1 : 0, prev.y)?.info,
						seatName: returnElement(prev.x !== 0 ? prev.x - 1 : 0, prev.y)?.seatName,
					}))
				}
				if (event.key === 'ArrowUp') {
					setSelectedCell((prev: GridPoint) => ({
						...prev,
						y: prev.y !== 0 ? prev.y - 1 : 0,
						info: returnElement(prev.x, prev.y !== 0 ? prev.y - 1 : 0)?.info,
						seatName: returnElement(prev.x, prev.y !== 0 ? prev.y - 1 : 0)?.seatName,
					}))
				}
				if (event.key === 'ArrowRight') {
					setSelectedCell((prev: GridPoint) => ({
						...prev,
						x: prev.x !== xSize - 1 ? prev.x + 1 : xSize - 1,
						info: returnElement(prev.x !== xSize - 1 ? prev.x + 1 : xSize - 1, prev.y)?.info,
						seatName: returnElement(prev.x !== xSize - 1 ? prev.x + 1 : xSize - 1, prev.y)?.seatName,
					}))
				}
				if (event.key === 'ArrowDown') {
					setSelectedCell((prev: GridPoint) => ({
						...prev,
						y: prev.y !== ySize - 1 ? prev.y + 1 : ySize - 1,
						info: returnElement(prev.x, prev.y !== ySize - 1 ? prev.y + 1 : ySize - 1)?.info,
						seatName: returnElement(prev.x, prev.y !== ySize - 1 ? prev.y + 1 : ySize - 1)?.seatName,
					}))
				}
			}
		}
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keyup', handleKeyUp);
		}
	}, [selectedCell]);


	const handleCellClick = (point: GridPoint) => {
		setSelectedCell({ x: point.x, y: point.y, info: point.info, seatName: point.seatName })
		// setSelectedCell(point)
		setShowOptions(true)
		if (grid?.length) {
			setUpdateGrid(grid.flat())
		}
	};



	return (
		<>
			<div className="creation-table__wrapper">
				<div className="creation-table__body" id="isometric-container" style={{ width: xSize * 50 + 'px' }}>
					{grid?.map((row, rowIndex) => (
						<div className="creation-table__row" key={rowIndex}>
							{row.map((cell, columnIndex) => (
								<div
									ref={cellRef}
									className={`creation-table__col${cell.x === selectedCell?.x && cell.y === selectedCell?.y ? ' selected' : ''}`}
									key={columnIndex}
									onClick={() => handleCellClick(cell)}
								>
									<CellContent 
										create={true} 
										setSeatName={setSeatName} 
										setAction={setAction} 
										cell={cell} 
									/>
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