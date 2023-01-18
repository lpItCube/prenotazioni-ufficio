import { useSession } from "next-auth/react"
import { useState } from "react"
import Modal from "./modal"

// Components
import Room from "./Rooms/Room"
import Legenda from "./Rooms/Legenda"
import RoomsNavigator from "./Rooms/RoomsNavigator"


type Seats = {
  meeting:any[],
  it:any[]
}

function FirstOffice({ 
  reserveData, 
  setReserveData, 
  fromTo,
  seatName,
  setSeatName,
  action,
  setAction,
}: any) {
  // const [seatName, setSeatName] = useState("none")
  // const [action, setAction] = useState("")
  const [visibleRoom, setVisibleRoom] = useState(0)
  const [nextRoom, setNextRoom] = useState(1)

  const session = useSession()
  let username = null
  
  if (session.data! !== undefined)
    username = session.data!.user!.name

  const handleVisibleRoom = () => {
    const maxLength = setRooms.length -1
    if(visibleRoom === 0 || visibleRoom !== maxLength) {
      setVisibleRoom(prev => prev+1)
    } else {
      setVisibleRoom(0)
    }
    if(nextRoom === 0 || nextRoom !== maxLength) {
      setNextRoom(prev => prev+1)
    } else {
      setNextRoom(0)
    }
  }

  let allSeats:Seats = {
    meeting: ["meet-1", "meet-2", "meet-3", "meet-4", "meet-5", "meet-6", "meet-7", "meet-8"],
    it: ["it-1", "it-2", "it-3", "it-4", "it-5", "it-6", "it-7", "it-8"]
  }

  const setRooms:any = [
    {
      username:username,
      isAdmin:username === "admin",
      reserveData:reserveData,
      roomType:"meeting",
      roomName:"Sala riunioni",
      hasBookAll:true,
      setSeatName:setSeatName,
      setAction:setAction,
    },
    {
      username:username,
      isAdmin:username === "admin",
      reserveData:reserveData,
      roomType:"it",
      roomName:"Sala IT",
      hasBookAll:false,
      setSeatName:setSeatName,
      setAction:setAction,
    }
  ]

  return session.data === undefined ?
    <div>Loading</div> :
    (
      <div className="rooms__external">
        
        <RoomsNavigator
          nextName={setRooms[nextRoom].roomName}
          onClick={() => handleVisibleRoom()}
        />
        <div className="rooms__container">
          <Legenda/>
          {setRooms.map((room:any, index:number) => {
            return (
              <Room
                key={index}
                id={index}
                rooms={setRooms}
                visibleRoom={visibleRoom}
                seats={allSeats}
                setSeatName={room.setSeatName}
                setAction={room.setAction}
              />
            )
          })}          
        </div>
        <Modal 
          seatName={seatName} 
          action={action} 
          username={username} 
          reserveData={reserveData} 
          setReserveData={setReserveData} 
          fromTo={fromTo} 
        />
      </div>
    )
}





export default FirstOffice;
