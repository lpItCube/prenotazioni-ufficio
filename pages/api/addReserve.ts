import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  seatId: string,
  userId: string,
  reservedDays: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: Data = req.body
  const seat = await prisma.seat.findUnique({
    where: {id: data.seatId}
  })

  data.reservedDays.forEach(async (date) => {
    const reservations = await prisma.reserve.findMany({
      include: {
        seat: true
      },
      where: {
        reservedDays: {
          has: date
        }
      }
    })
    const roomReserved = reservations.filter((reserve: any) => reserve.seat.type === "meet-whole")
    if (roomReserved !== null && roomReserved.length > 0)
      res.status(403).json("Non puoi prenotare per questo giorno")
  })

  try {
    const result = await prisma.reserve.create({
      data: {
        ...data
      }
    })
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(404)
  }
}