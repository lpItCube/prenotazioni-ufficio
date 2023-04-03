import Seat from "./Seat";

const CellContent = ({ create, setSeatName, setAction, cell }: any) => {
    // const reserves = useSelector(getReserves)
    if (cell.info === "hChair" || cell.info === "vChair") {
        return (
            // reserves && 
            <>
                <Seat create={create} setSeatName={setSeatName} setAction={setAction} cell={cell} />
            </>
        )
        // return (
        //     <div style={{ position: "relative", textAlign: "center" }}>
        //         <hr style={{ position: "absolute", top: "22px", left: "0", width: "100%" }} />
        //         {
        //             // reserves && 
        //             <Seat create={create} setSeatName={setSeatName} setAction={setAction} cell={cell} />
        //         }
        //     </div>
        // )
    }
    // if (cell.info === "vChair") {
    //     return (
    //         <div style={{ position: "relative", textAlign: "center" }}>
    //             <div style={{ position: "relative", alignItems: "center", justifyContent: "center", height: "100%" }}>
    //                 <div style={{ position: "absolute", left: "24px", height: "100%", borderLeft: "1px solid grey" }}></div>
    //                 {
    //                     // reserves &&
    //                     <Seat create={create} setSeatName={setSeatName} setAction={setAction} cell={cell} />
    //                 }
    //             </div>
    //         </div>
    //     );
    // }
    if (cell.info === "vLine") {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <div style={{ height: "100%", borderLeft: "1px solid grey" }}></div>
            </div>
        );
    }
    if (cell.info === "hLine") {
        return (
            <hr style={{ width: "100%" }} />
        )
    }
    if (["quarter-circle-top-left", "quarter-circle-top-right", "quarter-circle-bottom-left",
        "quarter-circle-bottom-right"].includes(cell.info)) {
        return (
            <div className={"box-" + cell.info} style={{ display: "flex", height: "100%" }}>
                <div className={cell.info}></div>
            </div>
        )
    }
    else return <div></div>
}

export default CellContent