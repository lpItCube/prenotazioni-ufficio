// Components
import Button from "../Ui/Button"

// Utils
import { getStringHours } from "../../utils/datePharser"

// Redux
import { useSelector } from "react-redux"
import { getReserves } from "../../features/reserveSlice"
import Spinner from "../Ui/Spinner"
import { getActualRoomName } from "../../features/roomSlice"

const ADD = "ADD"
const ADDALL = "ADDALL"
const REQUESTALL = "REQUESTALL"

type ModalSingleReserveProps = {
    action: any,
    seatName: any,
    otherReserveInPeriod: any,
    userReserve: any,
    handleSeat: any,
    hitModalButton: {
        loading:boolean,
        id:any
    }
}

function ModalSingleReserve({
    action,
    seatName,
    otherReserveInPeriod,
    userReserve,
    handleSeat,
    hitModalButton
}: ModalSingleReserveProps) {

    const reserveData = useSelector(getReserves)
    const actualRoomName = useSelector(getActualRoomName)

    console.log('METHOD',action)
    return (
      <>
      <p className="modal__text txt-h6">

          {action === ADD && 
            <>
            Vuoi procedere con la prenotazione del posto
            <b>{' '+seatName}</b>
            </>
          }
          {action === ADDALL || action === REQUESTALL &&
            <>
            Vuoi prenotare l'intera stanza <b>{' '+actualRoomName}</b>
            </>
          }
          ?</p>
          {reserveData 
          && seatName === 'meet-room' 
          && otherReserveInPeriod 
          && otherReserveInPeriod.length > 0 
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
      {/* {console.log(hitModalButton.loading)} */}
      {!hitModalButton.loading 
        ? <Button
            onClick={() => handleSeat()}
            className={`cta ${action === ADD || action === ADDALL || action === REQUESTALL ? 'cta--secondary-ok' : 'cta--primary-delete'}`}
            type='button'
            icon={false}
            text={action === ADD || action === ADDALL || action === REQUESTALL ? 'Conferma' : 'Cancella'}/>
        : <Spinner/>
      }
      </>
    )
}

export default ModalSingleReserve