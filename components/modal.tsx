import { useEffect, useState } from "react"
import axios from "axios"

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal } from "../features/modalSlice"
import { getReserves, setDayReserves, setReserves } from "../features/reserveSlice"
import { getActualRoom } from "../features/roomSlice"

// Hooks 
import { useAuthHook } from "../hooks/useAuthHook"

// Utils
import { getOnlyDate, getStringHours } from "../utils/datePharser"

// Components
import Button from "./Ui/Button"
import ModalComponent from "./Ui/ModalComponent";
import { RiDeleteBin3Line } from "react-icons/ri";
import { TbClipboardCheck } from "react-icons/tb";
import ModalApprovation from "./Modals/ModalApprovation";
import ModalSingleReserve from "./Modals/ModalSingleReserve";
import { setUser } from "../features/authSlice"

const ADD = "ADD"
const DELETE = "DELETE"
const APPROVE = "APPROVE"
const MANAGE = "MANAGE"
const ADDALL = "ADDALL"
const REQUESTALL = "REQUESTALL"

function Modal({
  username,
  room,
  seatName,
  action,
  singleReserve,
  fromTo,
  setHandleDelete
}: any) {

  const dispatch = useDispatch()
  const reserveData = useSelector(getReserves)
  const roomId = useSelector(getActualRoom)
  const { userData } = useAuthHook()
  const userId: string = userData.id
  const userRole = userData.role
  const [hitModalButton, setHitModalButton] = useState({ loading: false, id: null })


  const toApprove = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.seat.type === 'meet-whole' && res.status === 'pending')
  const reservedIndDay = reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.seat.type === 'meet-whole' && res.status === 'accepted')

  const [userReserve, setUserReserve] = useState([])

  useEffect(() => {
    if (userRole === 'USER') {
      setUserReserve(reserveData && reserveData.length > 0 && reserveData.filter((res: any) => res.user.id === userId))
    } else {
      setUserReserve(reserveData)
    }
    // if(userReserve.length > 0) {
    //   userReserve = actualRoom === 'meet' 
    //     ? userReserve.filter((res:any) => res.seat.type === actualRoom || res.seat.type === 'meet-whole')
    //     : userReserve.filter((res:any) => res.seat.type === actualRoom)
    // }
  }, [reserveData])



  const handleCloseModal = () => {
    setHitModalButton({ loading: false, id: null })
    dispatch(toggleModal(false))
  }

  let otherReserveInPeriod

  if (reserveData.length > 0) {
    otherReserveInPeriod = reserveData.filter((reserve: any) => reserve.seat.type !== 'meet-whole' && reserve.seat.type !== 'it')
  }

  async function reloadData() {
    console.log('SET RES 2',fromTo)

    const reserves = await (await axios.get(`/api/roomReserves/${roomId}`)).data
    // const reloadData = reserves.filter((r: any) => (new Date(r.from) >= new Date(fromTo.from as string) && new Date(r.to) <= new Date(fromTo.to as string) ))
    const reloadData = reserves.filter((r: any) => (
      new Date(fromTo.from) >= new Date(r.from) && new Date(fromTo.from) < new Date(r.to) ||
      new Date(r.to) > new Date(fromTo.from) && new Date(r.to) <= new Date(fromTo.to)
    ))

    const selectDate = getOnlyDate(fromTo.from)
    const allDayReserve = reserves.filter((r:any) => (
      selectDate === getOnlyDate(r.from) && r.user.id === userId
    ))
    
    dispatch(setDayReserves({ dayReserveData:allDayReserve }))
    dispatch(setReserves({ reserveData: reloadData }))
  }

  async function requestRoom() {
    setHitModalButton({ loading: true, id: null })
    const room = await (await axios.get(`/api/room/${roomId}`)).data
    const wholeRoom = room.seat.find((s: any) => s.type === "whole")
    await axios.post("/api/addReserve", {
      seatId: wholeRoom.id,
      userId: userId,
      reservedDays: [],
      from: new Date(fromTo.from),
      to: new Date(fromTo.to),
      status: 'pending'
    })
    await reloadData()
    handleCloseModal()
  }

  async function handleRoom() {
    setHitModalButton({ loading: true, id: null })
    const bookStatus = userRole === 'ADMIN' ? 'accepted' : 'pending'
    const room = await (await axios.get(`/api/room/${roomId}`)).data
    const wholeRoom = room.seat.find((s: any) => s.type === "whole")

    await reserveData.forEach(async (reserve: any) => {
      await axios.delete("/api/reserve/" + reserve.id)
      //TODO notifica per ogni utente la cui prenotazione è stata cancellata
    })

    await axios.post("/api/addReserve", {
      seatId: wholeRoom.id,
      userId: userId,
      reservedDays: [],
      from: new Date(fromTo.from),
      to: new Date(fromTo.to),
      status: 'accepted'
    })

    await reloadData()
    handleCloseModal()
  }

  async function handleSeat() {
    setHitModalButton({ loading: true, id: null })

    const seatId = await (await axios.get(`/api/seats/${seatName}`)).data.id
    let bookStatus = 'accepted'

    if (action === ADD) {
      if (seatName === 'meet-room') {

        // Quando prenoti tutta la stanza

        bookStatus = userRole !== 'USER' ? 'accepted' : 'pending'
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
        to: new Date(fromTo.to),
        status: bookStatus
      })

    } else if (action === DELETE) {

      let reserveToDelete

      if (reserveData.length > 0 && !singleReserve) {
        reserveToDelete = reserveData.find((reserve: any) => reserve.seat.name === seatName)
      } else {
        reserveToDelete = singleReserve
      }

      await axios.delete("/api/reserve/" + reserveToDelete.id);
      setHandleDelete(true)
    }

    handleCloseModal()
    if (fromTo) {
      await reloadData()
    }

    if (setHandleDelete) {
      setHandleDelete(true)
    }

  }


  async function handleApprovation(status: any, id: any) {
    setHitModalButton({ loading: true, id: id })
    if (status === 'approved') {
      await axios.patch("/api/reserve/approveReserve", {
        id
      })
      await reloadData()
    } else {
      const deleteSeat = await axios.delete("/api/reserve/" + id);
      const reserves = await (await axios.get(`/api/roomReserves/${roomId}`)).data
      const reloadData = reserves.filter((r: any) =>
        !(new Date(r.from) > new Date(fromTo.to as string) || new Date(r.to) < new Date(fromTo.from as string)
        ))
      dispatch(setReserves({ reserveData: reloadData }))
      setHitModalButton({ loading: false, id: null })
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
      {action === ADD || action === ADDALL || action === REQUESTALL
        ?
        <ModalComponent
          modalTitle={`Aggiungi prenotazione`}
          subTitle={fromTo ? `fascia oraria: ${getStringHours(fromTo.from).hours} - ${getStringHours(fromTo.to).hours}` : ''}
          refType={'seats-modal'}
        >
          <ModalSingleReserve
            action={action}
            seatName={seatName}
            otherReserveInPeriod={otherReserveInPeriod}
            userReserve={userReserve}
            handleSeat={action === ADD ? handleSeat : action === ADDALL ? handleRoom : requestRoom}
            hitModalButton={hitModalButton}
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
            hitModalButton={hitModalButton}
          />
        </ModalComponent>
      }

      {userRole !== 'USER' && (action === APPROVE || action === MANAGE) &&
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
            hitModalButton={hitModalButton}
          />
        </ModalComponent>
      }

    </>


  )
}

export default Modal