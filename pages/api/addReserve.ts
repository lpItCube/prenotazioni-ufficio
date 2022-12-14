import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";
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

  // controlli
  data.reservedDays.forEach(async (date) => {
    const reservations = await prisma.reserve.findMany({
      include: {
        seat: true,
        user: true
      },
      where: {
        reservedDays: {
          has: date
        }
      }
    })
    const yourReserved = reservations.find((reserve: any) => reserve.user.id === data.userId)
    const roomReserved = reservations.find((reserve: any) => reserve.seat.type === "meet-whole")

    if(yourReserved && seat?.type !== "meet-whole") 
      res.status(403).json("Per questa data hai già prenotato un posto")
    else if (roomReserved && seat?.type === "meet")
      res.status(403).json("Non puoi prenotare la stanza già occupata")
    else 
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
  })
}