import { useEffect, useState} from "react"
import Modal from "./modal"

function FirstOffice({ seatsData }: any) {

  const [seatId, setSeatId] = useState("")

  useEffect(() => {
    const seats: HTMLCollection = document.getElementsByClassName("seat")
    for (var i = 0; i < seats.length; i++) {
      seats[i].addEventListener("click", (e: Event) => {
        setSeatId((e.target as HTMLElement).id);
        (document.getElementById("myModal") as HTMLElement).style.display = "flex"
      })
    }
  }, [])

  return (
    <>
    <Modal seatId={seatId} />
    <div className="office-container">
      <div className="office-margin">
        <div className="boss-room r-border"></div>
        <div className="hr-room r-border"></div>
        <div className="toilette r-border"></div>
        <div className="meeting-room r-border">
          <MeetDesk itSeatsData={seatsData}/>
        </div>
        <div className="hall"></div>
        <div className="cafe r-border"></div>
        <div className="it-room r-border">
          <ItDesk itSeatsData={seatsData}/>
        </div>
        <div className="sgabu r-border"></div>
      </div>
    </div>
    </>
  )
}

function MeetDesk({ itSeatsData }: any) {
  const meetSeats = itSeatsData.filter((seat: any) => seat.type === "meet")

  return(
    <div className="meet-desk desk">
      <div className="meet-desk-first-row desk-row">
        {meetSeats.map((seat: any, k: number) => {
          if(k < 3)
            return <div
              id={seat.name}
              key={seat.name} 
              className={seat.busy ? "meet-seat seat busy" : "meet-seat seat"}>
            </div>
        })}
      </div>
      <div className="meet-desk-second-row desk-row">
        {meetSeats.map((seat: any, k: number) => {
          if(k > 2 && k < 5) 
            return <div
              id={seat.name}
              key={seat.name} 
              className={seat.busy ? "meet-seat seat busy" : "meet-seat seat"}>
            </div>
        })}
      </div>
      <div className="meet-desk-third-row desk-row">
        {meetSeats.map((seat: any, k: number) => {
          if (k >= 5)
            return <div
            id={seat.name}
            key={seat.name} 
            className={seat.busy ? "meet-seat seat busy" : "meet-seat seat"}>
          </div>
        })}
      </div>
    </div>
  )
}

function ItDesk({ itSeatsData }: any) {
  const itSeats = itSeatsData.filter((seat: any) => seat.type === "it")

  return (
    <div className="it-desk desk">
      <div className="it-desk-first-row desk-row">
        {itSeats.map((seat: any, k: number) => {
          if(k < 4)
            return <div
              id={seat.name}
              key={seat.name} 
              className={seat.busy ? "it-seat seat busy" : "it-seat seat"}>
            </div>
        })}
      </div>
      <div className="it-desk-second-row desk-row">
        {itSeats.map((seat: any, k: number) => {
          if(k >= 4)
            return <div
              id={seat.name}
              key={seat.name} 
              className={seat.busy ? "it-seat seat busy" : "it-seat seat"}>
            </div>
        })}
      </div>
    </div>
  )
}

export default FirstOffice;