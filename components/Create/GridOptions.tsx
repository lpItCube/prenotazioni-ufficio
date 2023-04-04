import InputNumber from "../Ui/InputNumber"
import Button from "../Ui/Button"

interface GridOptionsProps {
    xCells: number,
    setXCells: (x: number) => void,
    yCells: number,
    setYCells: (y: number) => void,
    handleSave: () => void
}

function GridOptions(props: GridOptionsProps) {
    const {
        xCells,
        setXCells,
        yCells,
        setYCells,
        handleSave
    } = props

    return (
        <div className="room-creation__options">
            <div className="room-creation__grid-controller">
                <InputNumber
                    label="Colonne"
                    min={0}
                    value={xCells}
                    onChange={setXCells}
                />
                <InputNumber
                    label="Righe"
                    min={0}
                    value={yCells}
                    onChange={setYCells}
                />
            </div>
            {/* <button onClick={handleXY}>Submit Input</button> */}
            <Button
                type="button"
                icon=""
                text="Salva"
                className={`cta cta--primary`}
                onClick={handleSave}
            />
            {/* <button onClick={handleSave}>Save</button> */}
        </div>
    )
}

export default GridOptions