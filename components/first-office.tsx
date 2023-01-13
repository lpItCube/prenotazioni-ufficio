import { all } from "axios"
import { useSession } from "next-auth/react"
import { type } from "os"
import { useEffect, useState } from "react"
import Modal from "./modal"

// Components
import ChairOne from "./Rooms/IsometricOffice/ChairOne"
import ChairTwo from "./Rooms/IsometricOffice/ChairTwo"
import ChairThree from "./Rooms/IsometricOffice/ChairThree"
import ChairFour from "./Rooms/IsometricOffice/ChairFour"
import Desk from "./Rooms/IsometricOffice/Desk"
import MeetingRoom from "./Rooms/IsometricOffice/MeetingRoom"
import RoomHeader from "./Rooms/RoomHeader"
import InfoTable from "./Rooms/InfoTable"

const ADD = "ADD"
const DELETE = "DELETE"

function FirstOffice({ reserveData, setReserveData, fromTo }: any) {
  const [seatName, setSeatName] = useState("none")
  const [action, setAction] = useState("")


  const session = useSession()
  var username = null
  if (session.data! !== undefined)
    username = session.data!.user!.name

  return session.data === undefined ?
    <div>Loading</div> :
    (
      <>
        <div className="rooms__container">
          <div className="room__wrapper">
            <IsometricMeetDesk 
              reserveData={reserveData} 
              session={session} 
              setSeatName={setSeatName} 
              setAction={setAction} 
            />
          </div>
        </div>
        <Modal seatName={seatName} action={action} username={username} reserveData={reserveData} setReserveData={setReserveData} fromTo={fromTo} />
        <div className="office-container">
          <div className="office-margin">


            <div className="meeting-room r-border r-border-no-bottom">
              <MeetDesk reserveData={reserveData} session={session} setSeatName={setSeatName} setAction={setAction} />
            </div>

            <div className="it-room r-border r-border-no-right">
              <span className="text-name-room">Stanza it</span>
              <ItDesk reserveData={reserveData} session={session} setSeatName={setSeatName} setAction={setAction} />
            </div>


          </div>

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

function IsometricMeetDesk({ 
  reserveData, 
  session, 
  setSeatName, 
  setAction
}: any) {

  const [booked, setBooked] = useState<number>(0)
  const [yourBooked, setYourBooked] = useState<number>(0)
  const [availableForYou, setAvailableForYou] = useState<number>(0)

  const username = session!.data!.user!.name
  const isAdmin = username === "admin"
  console.log(isAdmin)

  var yourReserves = reserveData.filter((r: Reserve) => r.user.username === username)
  const wholeRoom = reserveData.find((r: Reserve) => r.seat.type === "meet-whole")
  const busyRes = reserveData.filter((r: Reserve) => r.seat.type === "meet")
  const isYourRoom = wholeRoom?.user.username === username

  const busyResAndRoom = reserveData.filter(({ seat: { type } }: Reserve) => type === "meet" || type === "meet-whole")
  //se hai una prenotazione per quella giornata tutti i posti non sono disponibili
  const allSeatsNotAvailable = yourReserves.length > 0
  //se non hai prenotato posti in it e non ci sono posti meet occupati da altri, puoi prenotare
  const roomIsBookable = (!yourReserves?.find((r: Reserve) => r.seat.type === "it") || isAdmin) && busyResAndRoom.find((r: Reserve) => r.user.username !== username) === undefined
  console.log("ROOM IS: " + roomIsBookable)
  var busySeats = busyRes.map((s: Reserve) => s.seat.name)
  const seats = ["meet-1", "meet-2", "meet-3", "meet-4", "meet-5", "meet-6", "meet-7", "meet-8"]
  const seatsFront = ["meet-1", "meet-2", "meet-3"]
  const seatsPrimarySx = ["meet-4"]
  const seatsPrimaryDx = ["meet-5"]
  const seatsBack = ["meet-6", "meet-7", "meet-8"]

  // Setta quanti posti sono prenotati per giorno
  useEffect(() => {
    if(wholeRoom) {
      // Tutta la stanza è prenotata
      setBooked(seats.length)
    } else if (!wholeRoom && busySeats) {
      // Solo alcuni posti sono prenotati
      setBooked(busySeats.length)
    } else {
      setBooked(0)
    }
  }, [busyRes, wholeRoom])

  // Conta quanti posti restano disponibili per l'utente
  useEffect(() => {
    if(!isAdmin && allSeatsNotAvailable) {
      setAvailableForYou(0)
    } else {
      setAvailableForYou(seats.length - booked)
    }
  }, [busyRes])

  useEffect(() => {
    const checkIsRoom = yourReserves?.find((r: Reserve) => r.seat.type === "meet-whole")
    if(checkIsRoom) {
      // Hai prenotato tutta la stanza
      setYourBooked(seats.length)
    } else {
      // Ne hai prenotate una, alcune o nessuna
      setYourBooked(yourReserves.length)
    }
  }, [isYourRoom, busyRes, yourReserves])



  const seatsElements = seats.map((seat) => {
    var busy = busySeats.includes(seat) || wholeRoom
    var available = !(allSeatsNotAvailable || busy) || (isAdmin && !busy)
    var isYourSeat = (allSeatsNotAvailable && yourReserves.find((r: Reserve) => r.seat.name === seat)) || wholeRoom?.user.username === username

    var elClass = `isometric__chair meet-seat seat ${busy && "busy"} ${isYourSeat && "your"} ${available && "available"}`

    return (
      <div
        id={seat} key={seat}
        className={elClass}
        onClick={
          () => {
            setSeatName(seat);
            if (!wholeRoom) {
              if (available || (isAdmin && !busy)) {
                setAction(ADD);
                (document.getElementById("myModal") as HTMLElement).style.display = "flex"
              }
              if (isYourSeat || (isAdmin && busy)) {
                setAction(DELETE);
                (document.getElementById("myModal") as HTMLElement).style.display = "flex"
              }
            }
          }
        }
      >
        {seatsFront.indexOf(seat) > -1 && <ChairOne />}
        {seatsPrimarySx.indexOf(seat) > -1 && <ChairTwo />}
        {seatsBack.indexOf(seat) > -1 && <ChairThree />}
        {seatsPrimaryDx.indexOf(seat) > -1 && <ChairFour />}
      </div>
    )
  })


  return (    
    <>
      <RoomHeader
        roomName="Sala riunioni"
        hasBookAll={true}
        isYourRoom={isYourRoom}
        roomIsBookable={roomIsBookable}
        setSeatName={setSeatName}
        setAction={setAction}
        ADD={ADD}
        DELETE={DELETE}
      />
      <div className="room__body">
        <InfoTable
          totlaPlace={seats.length}
          booked={booked}
          yourBooked={yourBooked}
          availableForYou={availableForYou}
        />
        <div className="room__container">
          {seatsElements.map((seat: any, k: number) => {
            return seat
          })
          }
          <Desk />
          <MeetingRoom />
        </div>
      </div>
    </>
  )
}


function MeetDesk({ reserveData, session, setSeatName, setAction }: any) {
  const username = session!.data!.user!.name
  const isAdmin = username === "admin"
  console.log(isAdmin)

  var yourReserves = reserveData.filter((r: Reserve) => r.user.username === username)
  const wholeRoom = reserveData.find((r: Reserve) => r.seat.type === "meet-whole")
  const busyRes = reserveData.filter((r: Reserve) => r.seat.type === "meet")
  const isYourRoom = wholeRoom?.user.username === username

  const busyResAndRoom = reserveData.filter(({ seat: { type } }: Reserve) => type === "meet" || type === "meet-whole")
  //se hai una prenotazione per quella giornata tutti i posti non sono disponibili
  const allSeatsNotAvailable = yourReserves.length > 0
  //se non hai prenotato posti in it e non ci sono posti meet occupati da altri, puoi prenotare
  const roomIsBookable = (!yourReserves?.find((r: Reserve) => r.seat.type === "it") || isAdmin) && busyResAndRoom.find((r: Reserve) => r.user.username !== username) === undefined
  console.log("ROOM IS: " + roomIsBookable)
  var busySeats = busyRes.map((s: Reserve) => s.seat.name)
  const seats = ["meet-1", "meet-2", "meet-3", "meet-4", "meet-5", "meet-6", "meet-7", "meet-8"]

  const seatsElements = seats.map((seat) => {
    var busy = busySeats.includes(seat) || wholeRoom
    var available = !(allSeatsNotAvailable || busy) || (isAdmin && !busy)
    var isYourSeat = (allSeatsNotAvailable && yourReserves.find((r: Reserve) => r.seat.name === seat)) || wholeRoom?.user.username === username

    var elClass = `meet-seat seat ${busy && "busy"} ${isYourSeat && "your"} ${available && "available"}`

    return <div
      id={seat} key={seat}
      className={elClass}
      onClick={
        () => {
          setSeatName(seat);
          if (!wholeRoom) {
            if (available || (isAdmin && !busy)) {
              setAction(ADD);
              (document.getElementById("myModal") as HTMLElement).style.display = "flex"
            }
            if (isYourSeat || (isAdmin && busy)) {
              setAction(DELETE);
              (document.getElementById("myModal") as HTMLElement).style.display = "flex"
            }
          }
        }
      }
    >
      {seat}
    </div>
  })

  return (
    <>
      <div className="prenotazione-all">
        <span className="text-name-room">Sala riunione</span>
        <span
          id="meetAll"
          className={`btn-wholeroom ${isYourRoom ? "your" : roomIsBookable && "available"}`}
          onClick={
            () => {
              setSeatName("meet-room");
              if (roomIsBookable) {
                setAction(ADD);
                (document.getElementById("myModal") as HTMLElement).style.display = "flex"
              }
              if (isYourRoom) {
                setAction(DELETE);
                (document.getElementById("myModal") as HTMLElement).style.display = "flex"
              }
            }
            // isYourRoom || (isAdmin) ? () => {
            //   setYourSeat(true)
            //   setSeatName("meet-room");
            //   (document.getElementById("myModal") as HTMLElement).style.display = "flex"
            // } : roomIsBookable ? () =>{
            //   setSeatName("meet-room")
            //   setYourSeat(false);
            //   (document.getElementById("myModal") as HTMLElement).style.display = "flex"
            // } : () => {}
          }>
          Prenota stanza
        </span>
      </div>
      <div className="meet-desk desk">
        <div className="meet-desk-first-row desk-row">
          {seatsElements.map((seat: any, k: number) => {
            if (k < 3)
              return seat
          })}
        </div>
        <div className="meet-desk-second-row desk-row">
          {seatsElements.map((seat: any, k: number) => {
            if (k > 2 && k < 5)
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

function ItDesk({ reserveData, session, setSeatName, setAction }: any) {
  const username = session!.data!.user!.name
  const isAdmin = username === "admin"

  var yourReserves = reserveData.filter((r: Reserve) => r.user.username === username)
  const busyRes = reserveData.filter((r: Reserve) => r.seat.type === "it")
  var busySeats = busyRes.map((r: Reserve) => r.seat.name)
  const seats = ["it-1", "it-2", "it-3", "it-4", "it-5", "it-6", "it-7", "it-8"]

  const allSeatsNotAvailable = yourReserves.length > 0

  const seatsElements = seats.map((seat) => {
    var busy = busySeats.includes(seat)
    var available = !(allSeatsNotAvailable || busy) || (isAdmin && !busy)
    var isYourSeat = allSeatsNotAvailable && yourReserves.find((r: Reserve) => r.seat.name === seat)

    var elClass = `it-seat seat ${busy && "busy"} ${isYourSeat && "your"} ${available && "available"}`

    return <div
      id={seat} key={seat}
      className={elClass}
      onClick={
        () => {
          setSeatName(seat);
          if (available || (isAdmin && !busy)) {
            setAction(ADD);
            (document.getElementById("myModal") as HTMLElement).style.display = "flex"
          }
          if (isYourSeat || (isAdmin && busy)) {
            setAction(DELETE);
            (document.getElementById("myModal") as HTMLElement).style.display = "flex"
          }
        }
        // isYourSeat || (isAdmin && !available) ? () => {
        //   setSeatName(seat)
        //   setYourSeat(true);
        //   (document.getElementById("myModal") as HTMLElement).style.display = "flex"
        // } : 
        // !available ? () => {} : 
        // () => {
        //   setSeatName(seat)
        //   setYourSeat(false);
        //   (document.getElementById("myModal") as HTMLElement).style.display = "flex"
        // }
      }
    ></div>
  })

  return (
    <div className="it-desk desk">
      <div className="it-desk-first-row desk-row">
        {seatsElements.map((seat: any, k: number) => {
          if (k < 4)
            return seat
        })}
      </div>
      <div className="it-desk-second-row desk-row">
        {seatsElements.map((seat: any, k: number) => {
          if (k >= 4)
            return seat
        })}
      </div>
    </div>
  )
}

export default FirstOffice;
