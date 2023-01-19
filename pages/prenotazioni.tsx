import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

// Utils
import { getStringDate, getStringHours } from "../utils/datePharser"

// Components 
import Spinner from "../components/Ui/Spinner"

function Prenotazioni() {

  const session = useSession()
  const [reserves, setReserves] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getReserves = async () => {
      const response = await axios.get(`/api/userReserves/${session.data?.user?.name}`)
      setReserves(response.data)
    }
    setIsLoading(true)
    if (session.status === "authenticated")
      
      getReserves()

    setIsLoading(false)
  }, [session])

  console.log('RESERVES',reserves)

  if (session.status === "authenticated")
    return (
      <div
        className="prenotazioni__container"
      >
        <h2
          className="table__title"
        >
          Le tue prenotazioni
        </h2>
        <div className="table">
          <div className="table__header">
            <h6
              className="table__single-header"
            >
              Data
            </h6>
            <h6
              className="table__single-header"
            >
              Orario
            </h6>
            <h6
              className="table__single-header"
            >
              Postazione
            </h6>
          </div>
          <div className="table__body">
            {reserves.map((r:any, index:number) => {
              return(
                <div
                  key={index}
                  className='table__row'
                >
                  <div className="table__col">
                    <p>{getStringDate(r.from).day} {getStringDate(r.from).month} {getStringDate(r.from).year}</p>
                  </div>
                  <div className="table__col">
                    
                    <p>{getStringHours(r.from).hours} - {getStringHours(r.to).hours}</p>
                  </div>
                  <div className="table__col">
                    {r.seat.name}
                  </div>

                </div>
              )
            })}
          </div>
        </div>
        {/* <div>Le tue prenotazioni</div>
        <table className="table-prenotazioni">
          <thead>
            <tr>
              <th>Da</th>
              <th>A</th>
              <th>Postazione</th>
            </tr>
          </thead>
          <tbody>
            {reserves.map((r: any, index: any) => {
              console.log('RESERVES',getStringDate(r.to))
              return (
                <tr
                  key={index}
                >
                  <td>{r.from}</td>
                  <td>{r.to}</td>
                  <td>{r.seat.name}</td>
                </tr>
              )
            })}
          </tbody>
        </table> */}
      </div>
    )
  else return <div><Spinner/></div>
}

export default Prenotazioni