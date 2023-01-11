import axios from "axios"
import Router from "next/router"
import { useEffect, useImperativeHandle } from "react"

const NONE_VAL = "none"
const ADD = "ADD"
const DELETE = "DELETE"

function Modal({seatName, action, username, reserveData, setReserveData, fromTo}: any) { 

  useEffect(() => {
    var modal = document.getElementById("myModal") as HTMLElement
    var span = document.getElementsByClassName("close")[0] as HTMLElement

    span.onclick = function() {
      modal.style.display = NONE_VAL
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = NONE_VAL
      }
    }
  }, [])

  async function handleSeat() {

    var modal = document.getElementById("myModal") as HTMLElement
    modal.style.display = NONE_VAL

    const seatId = await (await axios.get(`/api/seats/${seatName}`)).data.id
    const userId = await (await axios.get(`/api/users/${username}`)).data.id

    console.log("FROM: " + fromTo.from)
    console.log("TO: " + fromTo.to)

    if (action === ADD) {
      await axios.post("/api/addReserve", {
        seatId: seatId,
        userId: userId,
        reservedDays: [],
        from: new Date(fromTo.from),
        to: new Date(fromTo.to)
      })
    } else if (action === DELETE) {
      const reserveToDelete = reserveData.find((reserve: any) => reserve.seat.name === seatName)
      await axios.delete("/api/reserve/" + reserveToDelete.id)
    }
    const reloadData = await (await axios.get(`/api/reserve?from=${fromTo.from}&to=${fromTo.to}`)).data
    setReserveData(reloadData)
  }

  return(
    <div id="myModal" className="modal">
    <div className="modal-content">
      <span className="close">&times;</span>
      <div className="modal-body">
        <p>{action === ADD ? 
            "Vuoi procedere con la prenotazione del posto " + seatName + "?" : 
            "Vuoi annullare la prenotazione del posto " + seatName + "?"
          }</p>
        {username === "admin" && <input></input>}
        <button className="modal-button" onClick={() => handleSeat()} >Conferma</button>
      </div>
    </div>
  </div>
  )
}

export default Modal