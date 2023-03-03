import { useEffect } from "react";
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';
import { useRouter } from "next/router"
import Spinner from "../components/Ui/Spinner";

function Home() {

  const router = useRouter()

  useEffect(() => {
    router.push('/prenota')
  },[])

  return <Spinner/>
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  await prisma.reserve.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.room.deleteMany()
  await prisma.office.deleteMany()
  await prisma.user.deleteMany()
  await prisma.domain.deleteMany()

  await prisma.domain.createMany(
    {
      data: [
        { name: "ITCube" }
      ]
    }
  )

  const domain = await prisma.domain.findUnique({
    where: { name: "ITCube" }
  })

  await prisma.user.createMany(
    {
      data: [
        { username: "admin", password: "admin", role:'ADMIN', domainId: domain!.id },
        { username: "user1", password: "user1", role:'USER', domainId: domain!.id },
        { username: "user2", password: "user2", role:'USER', domainId: domain!.id }  
      ]
    }
  )

  await prisma.office.createMany({
    data: [
      { domainId: domain!.id, name: "San Vittore" }
    ]
  })

  const office = await prisma.office.findUnique({ where: {name: "San Vittore"} } )

  await prisma.room.createMany({
    data: [
      { name: "IT", officeId: office!.id }
    ]
  })

  return {
    props: { }
  }
}