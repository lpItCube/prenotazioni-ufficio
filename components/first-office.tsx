import Router from "next/router"
import { useEffect, useState} from "react"
import Modal from "./modal"

function FirstOffice({ reserveData, date }: any) {
  const [seatId, setSeatId] = useState("")

  useEffect(() => {
    const seats: any = document.querySelectorAll(".seat:not(.busy)");

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
        <div className="boss-room r-border r-border-no-bottom">
          <span className="text-name-room">Direzione</span>
        </div>
        <div className="hr-room r-border r-border-no-left r-border-no-right">
          <span className="text-name-room">Hr</span>
        </div>
        <div className="toilette r-border ">
          <span className="text-name-room">toilette</span>
        </div>
        <div className="meeting-room r-border r-border-no-bottom">
          <div className="prenotazione-all">
            <span className="text-name-room">Sala riunione</span>
            <span id="meetAll" className="button-all" onClick={() =>{
              setSeatId("all");
              (document.getElementById("myModal") as HTMLElement).style.display = "flex"
            }}>Prenotazione unica</span>
          </div>

          <MeetDesk reserveData={reserveData}/>
        </div>
        <div className="hall ">

          { /*
          <span className="text-name-room">Hall</span>
          */
          }
        </div>
        <div className="cafe r-border ">
          <span className="text-name-room">Caffe</span>
        </div>
        <div className="it-room r-border r-border-no-right">
          <span className="text-name-room">Stanza it</span>
          <ItDesk reserveData={reserveData}/>
        </div>
        <div className="sgabu r-border">
          <span className="text-name-room">Ripostiglio</span>
        </div>
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
