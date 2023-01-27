// Components
import Button from "../Ui/Button"

// Utils
import { getStringHours } from "../../utils/datePharser"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { getReserves, setReserves } from "../../features/reserveSlice"

const ADD = "ADD"
const DELETESINGLE = "DELETESINGLE"

type ModalSingleReserveProps = {
    action: any,
    seatName: any,
    otherReserveInPeriod: any,
    userReserve: any,
    handleSeat: any,
    singleReserve:any
}

function ModalSingleReserve({
    action,
    seatName,
    otherReserveInPeriod,
    userReserve,
    handleSeat,
    singleReserve
}: ModalSingleReserveProps) {

    const reserveData = useSelector(getReserves)

    return (

        <>
            <p
                className="modal__text txt-h6"
            >
                {action === ADD && "Vuoi procedere con la prenotazione del posto "}
                {action === DELETESINGLE && "Vuoi annullare la prenotazione del posto "}
                <b>{seatName}</b>?</p>
                {reserveData 
                && seatName === 'meet-room' 
                && otherReserveInPeriod 
                && otherReserveInPeriod.length > 0 
                && action === !DELETESINGLE
                &&
                <>
                    <br />
                    <p
                        className="modal__text modal__text--warning txt-h6"
                    >Attenzione! Sono già presenti prenotazioni per questi orari, procedendo verranno cancellate.</p>
                    <div className="approve__container">
                        {
                            userReserve.length > 0 && userReserve.filter((res: any) => res.seat.type === 'meet').map((res: any) => {
                                const status = res.status === 'accepted' ? 'accepted' : 'pending'
                                return (
                                    <div key={res.id} className={`approve__reserve ${status}`}>
                                        <div className="approve__row--info">
                                            <div className="approve__row--user">{res.user.username}</div>
                                            <div className="approve__row">{res.seat.name}</div>
                                            {res.from &&
                                                <div className="approve__row">{getStringHours(res.from).hours} - {getStringHours(res.to).hours}</div>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
            }
            <Button
                onClick={() => handleSeat()}
                className={`cta ${action === ADD ? 'cta--secondary-ok' : 'cta--primary-delete'}`}
                type='button'
                icon={false}
                text={action === ADD ? 'Conferma' : 'Cancella'}
            />
        </>
    )
}

export default ModalSingleReserve