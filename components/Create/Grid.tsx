import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { GridPoint } from "../../types";
import { getModalStatus, setModalType, toggleModal } from "../../features/modalSlice";
import CellContent from "./CellContent";

function Grid({ fromTo, setSeatName, setAction, room }: any) {
    const { xSize, ySize, gridPoints } = room;
    const [grid, setGrid] = useState<GridPoint[][]>([])
    const session = useSession()
    const dispatch = useDispatch()
    const modalStatus: boolean = useSelector(getModalStatus)

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

    const bookRoom = () => {
        const role = session.data!.user!.role
        //prenota tutti posti se sei admin
        dispatch(toggleModal(!modalStatus))
        dispatch(setModalType('seats-modal'))
        if (role === "ADMIN") {
            setAction("ADDALL")
        } else {
            setAction("REQUESTALL")
        }
        //se non sei admin mandi una richiesta
    }

    return (
        <>
            <button onClick={bookRoom}> Prenota Stanza </button>
            <table style={{ width: "auto" }}>
                <tbody>
                    {grid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, columnIndex) => (
                                <td key={columnIndex} style={{ height: "50px", width: "50px" }}>
                                    <CellContent fromTo={fromTo} setSeatName={setSeatName} setAction={setAction} cell={cell} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Grid