import { useEffect, useState } from "react"
import HandleRoom from "./Create/HandleRoom"
import { useSession } from "next-auth/react"
import { useDispatch, useSelector } from "react-redux"
import { getModalStatus, setModalType, toggleModal } from "../features/modalSlice"

type Domain = {
  id: string
  name: string
  office: Office[]
}

type Office = {
  [x: string]: any
  id: string
  name: string
  domainId: string
  room: Room[]
}

type Room = {
  id: string
  name: string
  gridPoints: []
  officeId: string
  xSize: number
  ySize: number
}

function HandleOffice({ fromTo, action, setAction, domain }: { fromTo: any, action: any, setAction: any, domain: Domain }) {
  const session = useSession()
  const dispatch = useDispatch()
  const modalStatus: boolean = useSelector(getModalStatus)
  const [selectedOffice, setSelectedOffice] = useState<undefined | Office>(undefined)
  const [selectedRoom, setSelectedRoom] = useState<undefined | Room>(undefined)

  const handleSelectOffice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const officeId = e.target.value
    const office = domain.office.find((office: Office) => office.id === officeId)
    setSelectedOffice(office)
  }

  const handleSelectRoom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = e.target.value
    const room = selectedOffice!.room.find((room: Room) => room.id === roomId)
    setSelectedRoom(room)
  }

  const bookRoom = () => {
    const role = session.data!.user!.role
    //prenota tutti posti se sei admin
    dispatch(toggleModal(!modalStatus))
    dispatch(setModalType('seats-modal'))
    if (role === "ADMIN") {
      setAction("ADDALL")
    } else {
      setAction("REQUESTALL")
    }
    //se non sei admin mandi una richiesta
  }

  console.log(selectedRoom)
  return (
    <>
      <div>
        <label>Select an office aaa</label>
        <select onChange={handleSelectOffice}>
          <option value="">-- Select an option --</option>
          {domain?.office!.map((office: any, key: number) =>
            <option key={key} value={office.id}>{office.name}</option>
          )}
        </select>
      </div>
      {selectedOffice &&
        <div>
          <label>Select a room</label>
          <select onChange={handleSelectRoom}>
            <option value="">-- Select an option --</option>
            {selectedOffice.room.map((room: any, key: number) =>
              <option key={key} value={room.id}>{room.name}</option>
            )}
          </select>
        </div>
      }
      {selectedRoom &&
        <button onClick={bookRoom}> Prenota Stanza </button>
      }
      {selectedRoom &&
        <HandleRoom fromTo={fromTo} action={action} setAction={setAction} roomId={selectedRoom.id} create={false} />
      }
    </>
  )
}

export default HandleOffice