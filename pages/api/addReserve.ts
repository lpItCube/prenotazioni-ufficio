import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  seatId: string,
  userId: string,
  reservedDays: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: Data = req.body
  try {
    const result = await prisma.reserve.create({
      data: {
        userId: data.userId, seatId: data.seatId, reservedDays: data.reservedDays
      }
    })
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(404)
  }
}