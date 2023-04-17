// Costants
import { OPTION_B_TABLE_LEFT, OPTION_B_TABLE_RIGHT, OPTION_CHAIR, OPTION_H_LINE_LEFT, OPTION_H_LINE_RIGHT, OPTION_T_TABLE_LEFT, OPTION_T_TABLE_RIGHT, OPTION_V_LINE_BOTTOM, OPTION_V_LINE_TOP } from "../../_shared";

// Types
import { GridPoint } from "../../types";

// Components
import Seat from "./Seat";

interface CellContentProps {
    create: boolean,
    setSeatName: (seatName: string) => void,
    setAction: (action: number) => void,
    cell: GridPoint
}

const CellContent: React.FC<CellContentProps> = (props): JSX.Element => {

    const { create, setSeatName, setAction, cell } = props


    if (cell.info === OPTION_CHAIR) {
        return (
            <Seat create={create} setSeatName={setSeatName} setAction={setAction} cell={cell} />
        )
    }

    if (cell.info === OPTION_H_LINE_LEFT || cell.info === OPTION_H_LINE_RIGHT) {
        return (
            <div
                className="box-line__vertical"
            >
                <div className={`creation-options__table--${cell.info}`}></div>
            </div>
        );
    }
    if (cell.info === OPTION_V_LINE_TOP || cell.info === OPTION_V_LINE_BOTTOM) {
        return (
            <div className={`creation-options__table--${cell.info}`}></div>
        )
    }
    if ([OPTION_T_TABLE_RIGHT, OPTION_T_TABLE_LEFT, OPTION_B_TABLE_LEFT, OPTION_B_TABLE_RIGHT].includes(cell.info as string)) {
        return (
            <div className={"box-" + cell.info}>
                <div className={`creation-options__table--angle-${cell.info}`}></div>
            </div>
        )
    }
    else return <div></div>
}

export default CellContent