import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const roomId = req.query.roomId as string

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { seat: { include: { reserve: true } } }
    })

    res.status(200).json(room)
  } catch(e) {
    res.status(404)
  }
}