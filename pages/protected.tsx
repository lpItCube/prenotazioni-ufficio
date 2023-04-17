import { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import Router from "next/router"
import { AUTH_KO, AUTH_OK } from "../_shared"

const Protected: NextPage = (): JSX.Element => {
  const { status, data } = useSession()

  useEffect(() => {
    if (status === AUTH_KO ) Router.replace("/login")
  }, [status])

  if (status === AUTH_OK)
    return (
      <div>
        This page is Protected for special people.
        {JSON.stringify(data.user, null, 2)}
      </div>
    )
  
  return <div>loading</div>
}

export default Protected