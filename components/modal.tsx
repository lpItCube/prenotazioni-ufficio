import axios from "axios"

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal, getModalStatus } from "../features/modalSlice"
import { getUserRole, getUserId } from "../features/authSlice";

// Utils
import { getStringDate, getStringHours } from "../utils/datePharser"

// Components
import Button from "./Ui/Button"
import ModalComponent from "./Ui/ModalComponent";
import { RiDeleteBin3Line } from "react-icons/ri";
import { TbClipboardCheck } from "react-icons/tb";
import ModalApprovation from "./Rooms/ModalApprovation";

const ADD = "ADD"
const DELETE = "DELETE"
const APPROVE = "APPROVE"
const DELETESINGLE = "DELETESINGLE"

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
  const userId: string = useSelector(getUserId)
  const userRole = useSelector(getUserRole)
  const toApprove = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.seat.type === 'meet-whole' && res.status === 'pending')
  const reservedIndDay = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.seat.type === 'meet-whole' && res.status === 'accepted')

  let userReserve: any
  if (userRole === 'USER') {
    userReserve = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.user.id === userId)
  } else {
    userReserve = reserveData
  }

  console.log('DELETE', userReserve)

  const handleCloseModal = () => {
    dispatch(toggleModal(false))
  }

  let otherReserveInPeriod

  if (reserveData.length > 0) {
    otherReserveInPeriod = reserveData.filter((reserve: any) => reserve.seat.type !== 'meet-whole' && reserve.seat.type !== 'it')
  }
  console.log('APPROVE', reserveData)

  async function handleSeat() {

    const seatId = await (await axios.get(`/api/seats/${seatName}`)).data.id
    const userId = await (await axios.get(`/api/users/${username}`)).data.id
    let bookStatus = 'accepted'

    // console.log("FROM: " + fromTo.from)
    // console.log("TO: " + fromTo.to)

    if (action === ADD) {
      if (seatName === 'meet-room') {
        // Quando prenoti tutta la stanza 

        bookStatus = userRole === 'ADMIN' ? 'accepted' : 'pending'
        // Se altri utenti hanno prenotato in quell'orario allora elimina le loro prenotazioni
        const otherReserveInPeriod = reserveData.filter((reserve: any) => reserve.seat.type !== 'meet-whole' && reserve.seat.type !== 'it')
        if (otherReserveInPeriod) {
          otherReserveInPeriod.map(async (reserveToDelete: any) => {
            const deleteSeat = await axios.delete("/api/reserve/" + reserveToDelete.id);
          })
        }
      }

      console.log('ACTION', fromTo.from)
      await axios.post("/api/addReserve", {
        seatId: seatId,
        userId: userId,
        reservedDays: [],
        from: new Date(fromTo.from),
        to: new Date(fromTo.to),
        status: bookStatus
      })
    } else if (action === DELETE || action === DELETESINGLE) {

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


  async function handleApprovation(status: any, id: any) {


    if (status === 'approved') {

      await axios.patch("/api/reserve/approveReserve", {
        id
      })
      const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
      setReserveData(reloadData)
    } else {

      const deleteSeat = await axios.delete("/api/reserve/" + id);
      const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
      setReserveData(reloadData)
      console.log('DELETE COUNT', userReserve)
      if (userReserve.length === 1) {
        handleCloseModal()
      }
    }
    if (toApprove.length === 1 && reservedIndDay.length === 0 || toApprove.length === 0 && reservedIndDay.length === 1) {
      handleCloseModal()
    }

  }

  console.log('RESERVED', reserveData)

  return (
    <>
      {action === ADD || action === DELETESINGLE
        ?
        <ModalComponent
          modalTitle={`${action === ADD ? 'Aggiungi' : 'Annulla'} prenotazione`}
          subTitle={`fascia oraria: ${getStringHours(fromTo.from).hours} - ${getStringHours(fromTo.to).hours}`}
          refType={'seats-modal'}
        >
          <p
            className="modal__text txt-h6"
          >
            {action === ADD && "Vuoi procedere con la prenotazione del posto "}
            {action === DELETESINGLE && "Vuoi annullare la prenotazione del posto "}
            <b>{seatName}</b>?</p>
            {reserveData && seatName === 'meet-room' && otherReserveInPeriod && otherReserveInPeriod.length > 0 &&
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
                      <div className={`approve__reserve ${status}`}>
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
            className={`cta ${action === ADD ? 'cta--secondary-ok' : 'cta--secondary-delete'}`}
            type='button'
            icon={false}
            text={action === ADD ? 'Conferma' : 'Cancella'}
          />
        </ModalComponent>
        : <ModalComponent
          modalTitle={`${action === ADD ? 'Aggiungi' : 'Gestisci'} prenotazione`}
          subTitle={fromTo ? `fascia oraria: ${getStringHours(fromTo.from).hours} - ${getStringHours(fromTo.to).hours}` : ''}
          refType={'seats-modal'}
        >
          <ModalApprovation
            reserve={userReserve}
            approvationAction={handleApprovation}
            buttonIconDelete={<RiDeleteBin3Line size={18} />}
            buttonIconAccept={false}
            pendingControl={false}
            pendingReserve={[]}
          />
        </ModalComponent>
      }

      {userRole === 'ADMIN' &&
        <ModalComponent
          modalTitle={`${action === APPROVE ? 'Approva' : 'Gestisci'} prenotazione`}
          subTitle={`fascia oraria: ${getStringHours(fromTo.from).hours} - ${getStringHours(fromTo.to).hours}`}
          refType={'approve-modal'}
        >
          <ModalApprovation
            reserve={reservedIndDay}
            approvationAction={handleApprovation}
            buttonIconDelete={<RiDeleteBin3Line size={18} />}
            buttonIconAccept={<TbClipboardCheck size={18} />}
            pendingControl={true}
            pendingReserve={toApprove}
          />
        </ModalComponent>
      }

    </>


  )
}

export default Modal