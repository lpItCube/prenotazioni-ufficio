import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const seatName = req.query.seatName as string
  console.log(seatName)
  try {
    const result = await prisma.seat.findUnique({
      where: { name: seatName }
    })
    res.status(200).json(result)
  } catch(e) {
    console.log(e)
    res.status(404)
  }
}