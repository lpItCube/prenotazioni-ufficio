import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const roomId = req.query.roomId as string
  try {
    const reserves = await prisma.reserve.findMany(
      {
        where: { seat: { roomId: roomId } },
        include: { seat: true, user: true }
      }
    )
    res.status(200).json(reserves)
  } catch(e) {
    console.log(e)
    res.status(404)
  }
}