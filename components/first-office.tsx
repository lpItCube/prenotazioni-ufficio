import { all } from "axios"
import { useSession } from "next-auth/react"
import { type } from "os"
import { useEffect, useState} from "react"
import Modal from "./modal"

function FirstOffice({ reserveData, date }: any) {
  const [seatName, setSeatName] = useState("none")
  const [yourSeat, setYourSeat] = useState("none")

  const session = useSession()
  var username = null
  if (session.data! !== undefined)
    username = session.data!.user!.name

  // useEffect(() => {
  //   const yourSeat: any = document.querySelectorAll(".your")
  //   console.log(yourSeat === undefined)
  //   if (yourSeat === undefined) {
  //     const seats: any = document.querySelectorAll(".seat:not(.busy)");
  //     seats.forEach((seat: any) => {
  //       seat.addEventListener("click", (e: Event) => {
  //         setSeatName((e.target as HTMLElement).id);
  //         (document.getElementById("myModal") as HTMLElement).style.display = "flex"
  //       })
  //     })
  //   }
  // }, [session])

  return session.data === undefined ?
  <div>Loading</div> :
  (
    <>
    <Modal seatName={seatName} yourSeat={yourSeat} username={username} reserveData={reserveData} date={date} />
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
          <MeetDesk reserveData={reserveData} session={session} setSeatName={setSeatName} setYourSeat={setYourSeat} />
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
          <ItDesk reserveData={reserveData} session={session} setSeatName={setSeatName} setYourSeat={setYourSeat} />
        </div>
        <div className="sgabu r-border">
          <span className="text-name-room">Ripostiglio</span>
        </div>
      </div>
    </div>
    </>
  )
}

type User = {
  id: String,
  username: String
}

type Seat = {
  id: String,
  name: String,
  type: String
}

type Reserve = {
  user: User,
  seat: Seat
}

function MeetDesk({ reserveData, session, setSeatName, setYourSeat }: any) {
  const username = session!.data!.user!.name
  const isAdmin = username === "admin"
  console.log(isAdmin)

  var yourReserve = reserveData.find((reserve: Reserve) => reserve.user.username === username)
  const wholeRoom = reserveData.find((reserve: Reserve) => reserve.seat.type === "meet-whole")
  const busyRes = reserveData.filter((reserve: Reserve) => reserve.seat.type === "meet")
  const isYourRoom = wholeRoom?.user.username === username

  const busyResAndRoom = reserveData.filter((reserve: Reserve) => reserve.seat.type === "meet" || reserve.seat.type === "meet-whole")
  //se hai una prenotazione per quella giornata tutti i posti non sono disponibili
  const allSeatsNotAvailable = yourReserve !== undefined
  //se non hai prenotato posti in it e non ci sono posti meet occupati da altri, puoi prenotare
  const roomIsBookable = yourReserve?.seat.type !== "it" && busyResAndRoom.find((r: Reserve) => r.user.username !== username) === undefined

  var busySeats = busyRes.map((s: Reserve) => s.seat.name)
  const seats = ["meet-1", "meet-2", "meet-3", "meet-4", "meet-5", "meet-6", "meet-7", "meet-8"]

  const seatsElements = seats.map((seat) => {
    var busy = busySeats.includes(seat) || wholeRoom
    var available = !(allSeatsNotAvailable || busy)
    var isYourSeat = (allSeatsNotAvailable && yourReserve.seat.name === seat) || wholeRoom?.user.username === username

    var elClass = `meet-seat seat ${busy && "busy"} ${isYourSeat && "your"} ${available && "available"}`

    return <div
      id={seat} key={seat}
      className={elClass}
      onClick={
        isYourRoom ? () => {} :
        isYourSeat || isAdmin ? () => {
          setYourSeat(seat);
          (document.getElementById("myModal") as HTMLElement).style.display = "flex"
        } : 
        !available ? () => {} : 
        () => {
          setSeatName(seat);
          (document.getElementById("myModal") as HTMLElement).style.display = "flex"
      }}
    ></div>
  })

  return(
    <>
    <div className="prenotazione-all">
      <span className="text-name-room">Sala riunione</span>
      <span 
        id="meetAll" 
        className={`btn-wholeroom ${isYourRoom ? "your" : roomIsBookable && "available"}`} 
        onClick={
          isYourRoom ? () => {
            setYourSeat("meet-room");
            (document.getElementById("myModal") as HTMLElement).style.display = "flex"
          } : roomIsBookable ? () =>{
            setSeatName("meet-room");
            (document.getElementById("myModal") as HTMLElement).style.display = "flex"
          } : () => {}}>Prenota stanza</span>
    </div>
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
    </>
  )
}

function ItDesk({ reserveData, session,  setSeatName, setYourSeat }: any) {
  const username = session!.data!.user!.name
  const isAdmin = username === "admin"

  var yourReserve = reserveData.find((reserve: any) => reserve.user.username === username)
  const busyRes = reserveData.filter((reserve: any) => reserve.seat.type === "it")
  var busySeats = busyRes.map((s: any) => s.seat.name)
  const seats = ["it-1", "it-2", "it-3", "it-4", "it-5", "it-6", "it-7", "it-8"]

  const allSeatsNotAvailable = yourReserve !== undefined

  const seatsElements = seats.map((seat) => {
    var busy = busySeats.includes(seat)
    var available = !(allSeatsNotAvailable || busy)
    var isYourSeat = allSeatsNotAvailable && yourReserve.seat.name === seat

    var elClass = `it-seat seat ${busy && "busy"} ${isYourSeat && "your"} ${available && "available"}`

    return <div
    id={seat} key={seat}
    className={elClass}
    onClick={
      isYourSeat || isAdmin ? () => {
        setYourSeat(seat);
        (document.getElementById("myModal") as HTMLElement).style.display = "flex"
      } : 
      !available ? () => {} : 
      () => {
        setSeatName(seat);
        (document.getElementById("myModal") as HTMLElement).style.display = "flex"
    }}
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
