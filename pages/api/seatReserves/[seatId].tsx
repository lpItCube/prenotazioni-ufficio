import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const seatId = req.query.seatId as string
  console.log("gatto")
  console.log(seatId)
  try {
    const result = await prisma.reserve.findMany({
      where: { 
        seat: {
          name: seatId
        }
      },
      include: {
        seat: true,
        user: true
      },
      orderBy: {
        from: "asc"
      }
    })
    res.status(200).json(result)
  } catch(e) {
    console.log(e)
    res.status(404)
  }
}