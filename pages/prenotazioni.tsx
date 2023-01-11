import axios from "axios"
import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

function Prenotazioni() {

  const session = useSession()
  const [reserves, setReserves] = useState([])

  useEffect(() => {
    async function getReserves() {
      const data = await (await axios.get(`/api/userReserves/${session.data?.user?.name}`)).data
      setReserves(data)
    }
    if(session.status === "authenticated")
      getReserves()
  }, [session])

  if(session.status === "authenticated")
    return (
      <div>
      <div>Le tue prenotazioni</div>
      <table className="table-prenotazioni">
        <thead>
          <tr>
            <th>Da</th>
            <th>A</th>
            <th>Postazione</th>
          </tr>
        </thead>
        <tbody>
          {reserves.map((r: any) => {
            return (
              <tr>
                <td>{r.from}</td>
                <td>{r.to}</td>
                <td>{r.seat.name}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    )
  else return <div>Loading</div>
}

export default Prenotazioni