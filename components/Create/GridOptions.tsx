import InputNumber from "../Ui/InputNumber"
import Button from "../Ui/Button"
import Spinner from "../Ui/Spinner"

interface GridOptionsProps {
    xCells: number,
    setXCells: (x: number) => void,
    yCells: number,
    setYCells: (y: number) => void,
    handleSave: () => void,
    isLoading: boolean
}

const GridOptions: React.FC<GridOptionsProps> = (props): JSX.Element => {

    const { xCells, setXCells, yCells, setYCells, handleSave, isLoading } = props

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
            {isLoading
                ? <Spinner />
                : <Button
                    type="button"
                    icon={false}
                    text="Salva"
                    className={`cta cta--primary`}
                    onClick={handleSave}
                />
            }
        </div>
    )
}

export default GridOptions