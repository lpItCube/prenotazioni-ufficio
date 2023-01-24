import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const reserveData = await prisma.reserve.findMany({
      include: {
        seat: true,
        user: true
      },
      where: {
        status:'pending'
      }
    })
    
    
    res.status(200).json(reserveData)
  } catch (e) {
    console.log(e)
    res.status(404)
  }
}