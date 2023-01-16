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

  const session = useSession()
  let username = null
  
  if (session.data! !== undefined)
    username = session.data!.user!.name

  const allSeats:Seats = {
    meeting: ["meet-1", "meet-2", "meet-3", "meet-4", "meet-5", "meet-6", "meet-7", "meet-8"],
    it: ["it-1", "it-2", "it-3", "it-4", "it-5", "it-6", "it-7", "it-8"]
  }

  return session.data === undefined ?
    <div>Loading</div> :
    (
      <>
        <div className="rooms__container">
          <div className="room__wrapper">
            <Room
              username={username}
              isAdmin={username === "admin"}
              reserveData={reserveData}
              seats={allSeats}
              roomType="meeting"
              roomName="Sala riunioni"
              hasBookAll={true}
              setSeatName={setSeatName}
              setAction={setAction}
            />
            <Room
              username={username}
              isAdmin={username === "admin"}
              reserveData={reserveData}
              seats={allSeats}
              roomType="it"
              roomName="Sala IT"
              hasBookAll={false}
              setSeatName={setSeatName}
              setAction={setAction}
            />
          </div>
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
