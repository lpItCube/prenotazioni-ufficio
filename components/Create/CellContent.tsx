import Seat from "./Seat";

const CellContent = ({ create, setSeatName, setAction, cell }: any) => {
    // const reserves = useSelector(getReserves)
    if (cell.info === "hChair" || cell.info === "vChair" || cell.info === "chair") {
        return (
            // reserves && 
            <>
                <Seat create={create} setSeatName={setSeatName} setAction={setAction} cell={cell} />
            </>
        )
    }

    if (cell.info === "hLineLeft" || cell.info === "hLineRight") {
        return (
            <div
                className="box-line__vertical"
            >
                <div className={`creation-options__table--${cell.info}`}></div>
            </div>
        );
    }
    if (cell.info === "vLineTop" || cell.info === "vLineBottom") {
        return (
            <div className={`creation-options__table--${cell.info}`}></div>
        )
    }
    if (["tl", "tr", "bl","br"].includes(cell.info)) {
        return (
            <div className={"box-" + cell.info}>
                <div className={`creation-options__table--angle-${cell.info}`}></div>
            </div>
        )
    }
    else return <div></div>
}

export default CellContent