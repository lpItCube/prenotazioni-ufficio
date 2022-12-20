import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = req.query.userId as string
  try {
    const result = await prisma.reserve.findMany({
      where: { 
        user: {
          username: username
        }
      },
      include: {
        seat: true
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