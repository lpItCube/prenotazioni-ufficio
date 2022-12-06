import Link from "next/link"
import { useEffect } from "react"

function Modal({seatId}: any) { 
  console.log(seatId)
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

  return(
    <div id="myModal" className="modal">
    <div className="modal-content">
      <span className="close">&times;</span>
      <div className="modal-body">
        <p>Vuoi procedere con la prenotazione?</p>
        <Link className="modal-button" href={`/prenota/${seatId}`}>Conferma</Link>
      </div>
    </div>
  </div>
  )
}

export default Modal