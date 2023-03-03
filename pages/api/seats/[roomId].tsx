import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const seatName = req.query.roomId as string
  console.log("SEAT name -> " + seatName)
  try {
    const result = await prisma.seat.findUnique({
      where: { name: seatName }
    })
    console.log(result)
    res.status(200).json(result)
  } catch(e) {
    console.log(e)
    res.status(404)
  }

  if (req.method === "DELETE") {
    const roomId = req.query.roomId as string
    try {
      console.log("roomId -> ", roomId)
      await prisma.seat.deleteMany({
        where: { roomId: { contains: roomId } }
      })
      res.status(200)
    } catch (e) {
      console.log("ciao")
      console.log(e)
      res.status(404)
    }
  }
}