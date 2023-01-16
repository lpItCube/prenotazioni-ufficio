import axios from "axios"

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal, getModalStatus } from "../features/modalSlice"

// Components
import Button from "./Ui/Button"
import { IoClose } from "react-icons/io5";
import { Colors } from "./Ui/Colors";

const ADD = "ADD"
const DELETE = "DELETE"

function Modal({
  seatName,
  action,
  username,
  reserveData,
  setReserveData,
  fromTo
}: any) {

  const dispatch = useDispatch()
  const modalStatus: boolean = useSelector(getModalStatus)

  const handleCloseModal = () => {
    dispatch(toggleModal(false))
  }

  async function handleSeat() {


    const seatId = await (await axios.get(`/api/seats/${seatName}`)).data.id
    const userId = await (await axios.get(`/api/users/${username}`)).data.id

    console.log("FROM: " + fromTo.from)
    console.log("TO: " + fromTo.to)

    if (action === ADD) {
      await axios.post("/api/addReserve", {
        seatId: seatId,
        userId: userId,
        reservedDays: [],
        from: new Date(fromTo.from),
        to: new Date(fromTo.to)
      })
    } else if (action === DELETE) {
      const reserveToDelete = reserveData.find((reserve: any) => reserve.seat.name === seatName)
      await axios.delete("/api/reserve/" + reserveToDelete.id)
    }

    handleCloseModal()
    const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
    setReserveData(reloadData)
  }

  return (
    <div id="myModal" className={`modal${modalStatus ? ' show-modal' : ''}`}>
      <div onClick={() => handleCloseModal()} className={`modal__obscurer${modalStatus ? ' active' : ''}`}></div>
      <div className="modal__content">
        <div className="modal__header">
          <h5
            className="semiBold"
          >
            {action === ADD ? 'Aggiungi' : 'Annulla'} prenotazione
          </h5>
          <div
            onClick={() => handleCloseModal()}
            className="modal__close">
            <IoClose
              size={32}
              color={Colors.light700}
            />
          </div>
        </div>
        <div className="modal__body">
          <p
            className="modal__text txt-h6"
          >{action === ADD 
              ? "Vuoi procedere con la prenotazione del posto "
              : "Vuoi annullare la prenotazione del posto " 
          } <b>{seatName}</b>?</p>
          <Button
            onClick={handleSeat}
            className={`cta ${action === ADD ? 'cta--secondary-ok' : 'cta--secondary-delete'}`}
            type='button'
            icon={false}
            text={action === ADD ? 'Conferma' : 'Cancella'}
          />
        </div>
      </div>
    </div>
  )
}

export default Modal