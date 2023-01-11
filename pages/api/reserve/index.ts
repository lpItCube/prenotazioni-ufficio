import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { from, to } = req.query
  try {
    const reserveData = await prisma.reserve.findMany({
      include: {
        seat: true,
        user: true
      }
    })
    
    const filteredReserveDate = reserveData.filter(r => !(r.from > new Date(to as string) || r.to < new Date(from as string)))

    res.status(200).json(filteredReserveDate)
  } catch (e) {
    console.log(e)
    res.status(404)
  }
}