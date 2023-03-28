import { useEffect, useState } from "react"
import HandleRoom from "./handleRoom"

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

function HandleOffice({fromTo, action, setAction, domain} : {fromTo: any, action: any, setAction: any, domain: Domain}) {
  const [selectedOffice, setSelectedOffice] = useState<undefined|Office>(undefined)
  const [selectedRoom, setSelectedRoom] = useState<undefined|Room>(undefined)
  
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

  return (
    <div>
      <div>
        <label>Select an office aaa</label>
        <select onChange={handleSelectOffice}>
          <option value="">-- Select an option --</option>
          {domain?.office!.map((office: any, key: number) => 
            <option key={key} value={office.id}>{office.name}</option>
          )}
        </select>
      </div>
      { selectedOffice &&
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
      { selectedRoom &&
        <HandleRoom fromTo={fromTo} action={action} setAction={setAction} roomId={selectedRoom.id} create={false} />
      }
    </div>
  )
}

export default HandleOffice