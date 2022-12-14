import { useSession } from "next-auth/react"
import Router from "next/router"
import { useEffect } from "react"
import Calendar from "../../components/calendar"

function Prenota() {
  const { status, data } = useSession()

  const session = useSession()

  useEffect(() => {
    //if (status === "unauthenticated" ) Router.replace("/login")
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);

    console.log(status)
  }, [status])
  
  if(status === "authenticated")
    return (
      <Calendar />
    )
  else return <div>Loading</div>

  return <Calendar />
}

export default Prenota