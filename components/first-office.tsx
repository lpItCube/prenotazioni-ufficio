import { useSession } from "next-auth/react"
import { useState } from "react"
import Modal from "./modal"

// Components
import Room from "./Rooms/Room"
import RoomsNavigator from "./Rooms/RoomsNavigator"
import BookAll from "./Rooms/BookAll"
import Spinner from "./Ui/Spinner"

// Redux
import { useSelector, useDispatch } from "react-redux"
import { getReserves, setReserves } from "../features/reserveSlice"
import { getActualRoom } from "../features/roomSlice"

// Hooks
import { useAuthHook } from "../hooks/useAuthHook";

type Seats = {
  meet: any[],
  it: any[]
}

function FirstOffice({
  fromTo,
  seatName,
  setSeatName,
  action,
  setAction,
}: any) {


  const [visibleRoom, setVisibleRoom] = useState(0)
  const [nextRoom, setNextRoom] = useState(1)
  const { userData } = useAuthHook()
  const reserveData = useSelector(getReserves)
  const actualRoom = useSelector(getActualRoom)

  const session = useSession()
  let username = null

  const userRole = userData.role

  if (session.data! !== undefined)
    username = session.data!.user!.name

  const handleVisibleRoom = () => {
    const maxLength = setRooms.length - 1
    if (visibleRoom === 0 || visibleRoom !== maxLength) {
      setVisibleRoom(prev => prev + 1)
    } else {
      setVisibleRoom(0)
    }
    if (nextRoom === 0 || nextRoom !== maxLength) {
      setNextRoom(prev => prev + 1)
    } else {
      setNextRoom(0)
    }
  }

  let allSeats: Seats = {
    meet: ["meet-1", "meet-2", "meet-3", "meet-4", "meet-5", "meet-6", "meet-7", "meet-8"],
    it: ["it-1", "it-2", "it-3", "it-4", "it-5", "it-6", "it-7", "it-8"]
  }

  const needApproval = reserveData.filter((res:any) => res.seat.type === 'meet-whole' && res.status === 'pending').length > 0 && userRole === 'ADMIN'
  const notBookAll = userRole === 'USER' && reserveData.filter((res:any) => res.seat.type === actualRoom).length > 0

  console.log(notBookAll)

  const setRooms: any = [
    {
      username: username,
      reserveData: reserveData,
      roomType: "meet",
      roomName: "Sala riunioni",
      hasBookAll: true,
      setSeatName: setSeatName,
      setAction: setAction,
    },
    {
      username: username,
      reserveData: reserveData,
      roomType: "it",
      roomName: "Sala IT",
      hasBookAll: false,
      setSeatName: setSeatName,
      setAction: setAction,
    }
  ]

  return session.data === undefined ?
    <div><Spinner/></div> :
    (
      <div className="rooms__external">
        <RoomsNavigator
          nextName={setRooms[nextRoom].roomName}
          onClick={() => handleVisibleRoom()}
        />
        <div className="rooms__container">
          {setRooms.map((room: any, index: number) => {
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
          fromTo={fromTo}
        />
        <BookAll
          needApproval={needApproval}
          notBookAll={notBookAll}
          containerClass={'rooms__book-all'}
          setSeatName={setSeatName}
          setAction={setAction}
        />
      </div>
    )
}





export default FirstOffice;
