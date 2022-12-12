import axios from "axios"
import Link from "next/link"
import Router from "next/router"
import { useEffect } from "react"

function Modal({seatId, reserveData, date}: any) { 

  useEffect(() => {
    var modal = document.getElementById("myModal") as HTMLElement
    var span = document.getElementsByClassName("close")[0] as HTMLElement

    span.onclick = function() {
      modal.style.display = "none"
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none"
      }
    }
  }, [])

  async function reserveSeat() {

    await axios.get(`/api/seats/${seatId}`).then((seat: any) => {
      const seatIdentifier = seat.data.id
      
      axios.post("/api/addReserve", {
        seatId: seatIdentifier,
        userId: "28d9660b-7073-44fa-9602-873f03a73704",
        reservedDays: [date]
      })
    })
    Router.push("/prenota")
  }

  return(
    <div id="myModal" className="modal">
    <div className="modal-content">
      <span className="close">&times;</span>
      <div className="modal-body">
        <p>Vuoi procedere con la prenotazione del posto <b>{seatId}</b>?</p>
        <button className="modal-button" onClick={() => reserveSeat()} >Conferma</button>
      </div>
    </div>
  </div>
  )
}

export default Modal