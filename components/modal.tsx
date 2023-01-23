import { useState } from "react"
import axios from "axios"

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal, getModalStatus } from "../features/modalSlice"

// Components
import Button from "./Ui/Button"
import { IoClose } from "react-icons/io5";
import { Colors } from "./Ui/Colors";
import ModalComponent from "./Ui/ModalComponent";

const ADD = "ADD"
const DELETE = "DELETE"

function Modal({
  seatName,
  action,
  username,
  reserveData,
  setReserveData,
  fromTo,
  setHandleDelete
}: any) {

  const dispatch = useDispatch()
  const modalStatus: boolean = useSelector(getModalStatus)



  const handleCloseModal = () => {
    dispatch(toggleModal(false))
  }

  let otherReserveInPeriod

  if(reserveData.length > 0) {
    otherReserveInPeriod = reserveData.filter((reserve: any) => reserve.seat.type !== 'meet-whole' && reserve.seat.type !== 'it')
  }
  

  async function handleSeat() {

    const seatId = await (await axios.get(`/api/seats/${seatName}`)).data.id
    const userId = await (await axios.get(`/api/users/${username}`)).data.id

    // console.log("FROM: " + fromTo.from)
    // console.log("TO: " + fromTo.to)

    if (action === ADD) {
      if (seatName === 'meet-room') {
        // Quando prenoti tutta la stanza 
        // Se altri utenti hanno prenotato in quell'orario allora elimina le loro prenotazioni
        const otherReserveInPeriod = reserveData.filter((reserve: any) => reserve.seat.type !== 'meet-whole' && reserve.seat.type !== 'it')
        if (otherReserveInPeriod) {
          otherReserveInPeriod.map(async (reserveToDelete: any) => {
            const deleteSeat = await axios.delete("/api/reserve/" + reserveToDelete.id);
          })
        }
      }
      await axios.post("/api/addReserve", {
        seatId: seatId,
        userId: userId,
        reservedDays: [],
        from: new Date(fromTo.from),
        to: new Date(fromTo.to)
      })
    } else if (action === DELETE) {

      let reserveToDelete

      if (reserveData.length > 0) {
        reserveToDelete = reserveData.find((reserve: any) => reserve.seat.name === seatName)
      } else {
        reserveToDelete = reserveData
      }

      const deleteSeat = await axios.delete("/api/reserve/" + reserveToDelete.id);

    }



    handleCloseModal()
    if (setReserveData && fromTo) {
      const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
      setReserveData(reloadData)
    }

    if (setHandleDelete) {
      setHandleDelete(true)
    }

  }

  return (
    <ModalComponent
      modalTitle={`${action === ADD ? 'Aggiungi' : 'Annulla'} prenotazione`}
      refType={'seats-modal'}
    >
      <p
        className="modal__text txt-h6"
      >{action === ADD
        ? "Vuoi procedere con la prenotazione del posto "
        : "Vuoi annullare la prenotazione del posto "
        } <b>{seatName}</b>?</p>
        {reserveData && seatName === 'meet-room' && otherReserveInPeriod && otherReserveInPeriod.length > 0 && 
        <>
          <br/>
          <p
          className="modal__text modal__text--warning txt-h6"
          >Attenzione! Sono presenti prenotazioni di altri utenti per questi orari, procedendo verranno cancellate.</p>
        </>
        }
      <Button
        onClick={handleSeat}
        className={`cta ${action === ADD ? 'cta--secondary-ok' : 'cta--secondary-delete'}`}
        type='button'
        icon={false}
        text={action === ADD ? 'Conferma' : 'Cancella'}
      />
    </ModalComponent>
  )
}

export default Modal