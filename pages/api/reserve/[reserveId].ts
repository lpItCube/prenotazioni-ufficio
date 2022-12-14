import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reserveId = req.query.reserveId as string
  try {
    const result = await prisma.reserve.delete({
      where: { id: reserveId }
    })
    res.status(200).json(result)
  } catch(e) {
    console.log(e)
    res.status(404)
  }
}