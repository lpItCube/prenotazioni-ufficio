import axios from "axios"

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal, getModalStatus } from "../features/modalSlice"
import { getReserves, setReserves } from "../features/reserveSlice"

// Hooks 
import { useAuthHook } from "../hooks/useAuthHook"

// Utils
import { getStringDate, getStringHours } from "../utils/datePharser"

// Components
import Button from "./Ui/Button"
import ModalComponent from "./Ui/ModalComponent";
import { RiDeleteBin3Line } from "react-icons/ri";
import { TbClipboardCheck } from "react-icons/tb";
import ModalApprovation from "./Modals/ModalApprovation";
import ModalSingleReserve from "./Modals/ModalSingleReserve";

const ADD = "ADD"
const DELETE = "DELETE"
const APPROVE = "APPROVE"
const DELETESINGLE = "DELETESINGLE"
const MANAGE = "MANAGE"

function Modal({
  seatName,
  action,
  username,
  fromTo,
  setHandleDelete
}: any) {

  const dispatch = useDispatch()
  const reserveData = useSelector(getReserves)
  const modalStatus: boolean = useSelector(getModalStatus)
  const { userData } = useAuthHook()
  const userIdHooks: string = userData.id
  const userRole = userData.role
  const toApprove = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.seat.type === 'meet-whole' && res.status === 'pending')
  const reservedIndDay = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.seat.type === 'meet-whole' && res.status === 'accepted')

  let userReserve: any
  if (userRole === 'USER') {
    userReserve = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.user.id === userIdHooks)
  } else {
    userReserve = reserveData
  }


  const handleCloseModal = () => {
    dispatch(toggleModal(false))
  }

  let otherReserveInPeriod

  if (reserveData.length > 0) {
    otherReserveInPeriod = reserveData.filter((reserve: any) => reserve.seat.type !== 'meet-whole' && reserve.seat.type !== 'it')
  }


  async function handleSeat() {
    const seatId = await (await axios.get(`/api/seats/${seatName}`)).data.id
    let bookStatus = 'accepted'

    
    console.log('ADD')
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

      
      const addReserve = await axios.post("/api/addReserve", {
        seatId: seatId,
        userId: userIdHooks,
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
    if (fromTo) {
      const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
      dispatch(setReserves({reserveData:reloadData}))
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
      dispatch(setReserves({reserveData:reloadData}))
    } else {

      const deleteSeat = await axios.delete("/api/reserve/" + id);
      if(deleteSeat.status === 204) {
      }
      const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
      dispatch(setReserves({reserveData:reloadData}))
      if (userReserve.length === 1) {
        handleCloseModal()
      }
    }
    if (toApprove.length === 1 && reservedIndDay.length === 0 || toApprove.length === 0 && reservedIndDay.length === 1) {
      handleCloseModal()
    }

  }

  return (
    <>
      {action === ADD || action === DELETESINGLE
        ?
        <ModalComponent
            modalTitle={`${action === 'ADD' ? 'Aggiungi' : 'Annulla'} prenotazione`}
            subTitle={fromTo ? `fascia oraria: ${getStringHours(fromTo.from).hours} - ${getStringHours(fromTo.to).hours}` : ''}
            refType={'seats-modal'}
        >
          <ModalSingleReserve
            action={action}
            seatName={seatName}
            otherReserveInPeriod={otherReserveInPeriod}
            userReserve={userReserve}
            handleSeat={handleSeat}
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

      {userRole === 'ADMIN' && (action === APPROVE || action === MANAGE) &&
        <ModalComponent
          modalTitle={`${action === APPROVE ? 'Approva' : 'Gestisci'} prenotazione`}
          subTitle={fromTo ? `fascia oraria: ${getStringHours(fromTo.from).hours} - ${getStringHours(fromTo.to).hours}` : ''}
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