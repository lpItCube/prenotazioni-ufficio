import axios from "axios"
import Router from "next/router"
import { useEffect, useImperativeHandle } from "react"

const NONE_VAL = "none"

function Modal({seatName, yourSeat, username, reserveData, date}: any) { 

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
    const seatId = await (await axios.get(`/api/seats/${seatName !== NONE_VAL ? seatName : yourSeat}`)).data.id
    const userId = await (await axios.get(`/api/users/${username}`)).data.id

    if(seatName !== NONE_VAL) {
      
      await axios.post("/api/addReserve", {
        seatId: seatId,
        userId: userId,
        reservedDays: [date]
      })
    } else {
      const reserveToDelete = reserveData.find((reserve: any) => reserve.seat.name === yourSeat)
      await axios.delete("/api/reserve/" + reserveToDelete.id)
    }
    Router.push("/prenota")
  }

  return(
    <div id="myModal" className="modal">
    <div className="modal-content">
      <span className="close">&times;</span>
      <div className="modal-body">
        <p>{seatName !== NONE_VAL ? 
          "Vuoi procedere con la prenotazione del posto " + seatName + "?" :
          "Vuoi annullare la prenotazione del posto " + yourSeat + "?"
          }</p>
        {username === "admin" && <input></input>}
        <button className="modal-button" onClick={() => handleSeat()} >Conferma</button>
      </div>
    </div>
  </div>
  )
}

export default Modal