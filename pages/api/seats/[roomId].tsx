import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const seatName = req.query.roomId as string
  try {
    const result = await prisma.seat.findUnique({
      where: { name: seatName }
    })
    res.status(200).json(result)
  } catch(e) {
    console.log(e)
    res.status(404)
  }

  if (req.method === "DELETE") {
    const roomId = req.query.roomId as string
    console.log("DIO -> ", roomId)
    try {
      const result = await prisma.seat.deleteMany({
        where: { roomId: roomId }
      })
      res.status(200).json(result)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }
}