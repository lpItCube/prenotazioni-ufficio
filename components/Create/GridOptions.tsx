import InputNumber from "../Ui/InputNumber"
import Button from "../Ui/Button"

interface GridOptionsProps {
    xCells: number,
    setXCells: (x: number) => void,
    yCells: number,
    setYCells: (y: number) => void,
    handleSave: () => void
}

const GridOptions: React.FC<GridOptionsProps> = (props): JSX.Element => {
    
    const { xCells, setXCells, yCells, setYCells, handleSave } = props

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
            <Button
                type="button"
                icon={false}
                text="Salva"
                className={`cta cta--primary`}
                onClick={handleSave}
            />
        </div>
    )
}

export default GridOptions