import { useEffect, useState} from "react"
import Modal from "./modal"

function FirstOffice({ reserveData, date }: any) {
  const [seatId, setSeatId] = useState("")

  useEffect(() => {
    const seats: any = document.querySelectorAll(".seat:not(.busy)")

    seats.forEach((seat: any) => {
      seat.addEventListener("click", (e: Event) => {
        setSeatId((e.target as HTMLElement).id);
        (document.getElementById("myModal") as HTMLElement).style.display = "flex"
      })
    })
  }, [])

  return (
    <>
    <Modal seatId={seatId} reserveData={reserveData} date={date} />
    <div className="office-container">
      <div className="office-margin">
        <div className="boss-room r-border"></div>
        <div className="hr-room r-border"></div>
        <div className="toilette r-border"></div>
        <div className="meeting-room r-border">
          <MeetDesk reserveData={reserveData}/>
        </div>
        <div className="hall"></div>
        <div className="cafe r-border"></div>
        <div className="it-room r-border">
          <ItDesk reserveData={reserveData}/>
        </div>
        <div className="sgabu r-border"></div>
      </div>
    </div>
    </>
  )
}

function MeetDesk({ reserveData }: any) {
  const busySeats = reserveData.filter((reserve: any) => reserve.seat.type === "meet").map((s: any) => s.seat.name)
  const seats = ["meet-1", "meet-2", "meet-3", "meet-4", "meet-5", "meet-6", "meet-7", "meet-8"]

  const seatsElements = seats.map((seat) => {
    var elClass = busySeats.includes(seat) ? "meet-seat seat busy" : "meet-seat seat"
    return <div
      id={seat} key={seat}
      className={elClass}
    ></div>
  })

  return(
    <div className="meet-desk desk">
      <div className="meet-desk-first-row desk-row">
        {seatsElements.map((seat: any, k: number) => {
          if(k < 3)
            return seat
        })}
      </div>
      <div className="meet-desk-second-row desk-row">
        {seatsElements.map((seat: any, k: number) => {
          if(k > 2 && k < 5) 
            return seat
        })}
      </div>
      <div className="meet-desk-third-row desk-row">
        {seatsElements.map((seat: any, k: number) => {
          if (k >= 5)
            return seat
        })}
      </div>
    </div>
  )
}

function ItDesk({ reserveData }: any) {
  const busySeats = reserveData.filter((reserve: any) => reserve.seat.type === "it").map((s: any) => s.seat.name)
  const seats = ["it-1", "it-2", "it-3", "it-4", "it-5", "it-6", "it-7", "it-8"]

  const seatsElements = seats.map((seat) => {
    var elClass = busySeats.includes(seat) ? "it-seat seat busy" : "it-seat seat"
    return <div
      id={seat} key={seat}
      className={elClass}
    ></div>
  })


  return (
    <div className="it-desk desk">
      <div className="it-desk-first-row desk-row">
        {seatsElements.map((seat: any, k: number) => {
          if(k < 4)
            return seat
        })}
      </div>
      <div className="it-desk-second-row desk-row">
        {seatsElements.map((seat: any, k: number) => {
          if(k >= 4)
            return seat
        })}
      </div>
    </div>
  )
}

export default FirstOffice;