import { useSession } from "next-auth/react"
import { useState } from "react"
import Modal from "./modal"

// Components
import Room from "./Rooms/Room"

type Seats = {
  meeting:any[],
  it:any[]
}

function FirstOffice({ reserveData, setReserveData, fromTo }: any) {
  const [seatName, setSeatName] = useState("none")
  const [action, setAction] = useState("")
  const [visibleRoom, setVisibleRoom] = useState(0)

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
      <>
       <div
            onClick={() => handleVisibleRoom()}
          >{setRooms[visibleRoom].roomName}</div>
          {visibleRoom}
        <div className="rooms__container">
          {setRooms.map((room:any, index:number) => {
            return (
              <Room
                key={index}
                id={index}
                visibleRoom={visibleRoom}
                username={room.username}
                isAdmin={room.isAdmin}
                reserveData={room.reserveData}
                seats={allSeats}
                roomType={room.roomType.toString()}
                roomName={room.roomName}
                hasBookAll={room.hasBookAll}
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


        <div className="office-container">
          

          <div className="contentLegend">

            <div className="contentLegend-single">
              <div className="single-red"> </div>
              <p> Occupato </p>
            </div>

            <div className="contentLegend-single">
              <div className="single-green"> </div>
              <p> Disponibile </p>
            </div>

            <div className="contentLegend-single">
              <div className="single-yellow"> </div>
              <p> Il tuo posto  </p>
            </div>


            <div className="contentLegend-single">
              <div className="single-grey"> </div>
              <p> Non prenotabile  </p>
            </div>

          </div>
        </div>

      </>
    )
}





export default FirstOffice;
