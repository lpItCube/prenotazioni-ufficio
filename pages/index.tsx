import { GetStaticProps } from "next"
import prisma from '../lib/prisma';

function Home() {
  return <h1>Home Page</h1>
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  await prisma.reserve.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany(
    {
      data: [
        { username: "admin", password: "admin" },
        { username: "user1", password: "user1" },
        { username: "user2", password: "user2" }  
      ]
    }
  )

  const users = await prisma.user.findMany()

  console.log(users)

  await prisma.seat.createMany( 
    {
      data: [
        { name: "it-1", type: "it" },
        { name: "it-2", type: "it" },
        { name: "it-3", type: "it" },
        { name: "it-4", type: "it" },
        { name: "it-5", type: "it" },
        { name: "it-6", type: "it" },
        { name: "it-7", type: "it" },
        { name: "it-8", type: "it" },
        { name: "meet-1", type: "meet" },
        { name: "meet-2", type: "meet" },
        { name: "meet-3", type: "meet" },
        { name: "meet-4", type: "meet" },
        { name: "meet-5", type: "meet" },
        { name: "meet-6", type: "meet" },
        { name: "meet-7", type: "meet" },
        { name: "meet-8", type: "meet" },
        { name: "meet-room", type: "meet-whole" }
      ]
    }
  )

  const seat: any = await prisma.seat.findUnique({
    where: {name: "meet-1"}
  })

  const seat2: any = await prisma.seat.findUnique({
    where: {name: "meet-2"}
  })

  const seat3: any = await prisma.seat.findUnique({
    where: {name: "it-3"}
  })

  await prisma.reserve.createMany(
    {
      data: [
        { userId: users[0].id, seatId: seat.id, reservedDays: ["2022-12-6", "2022-12-7", "2022-12-8"] },
        { userId: users[1].id, seatId: seat2.id, reservedDays: ["2022-12-7"] },
        { userId: users[2].id, seatId: seat3.id, reservedDays: ["2022-12-7", "2022-12-8"] }
      ]
    }
  )

  const query = await prisma.reserve.findMany({
    include: {
      seat: true
    },
    where: {
      reservedDays: {
        has: "2022-12-06"
      }
    }
  })

  console.log(query)

  return {
    props: { }
  }
}