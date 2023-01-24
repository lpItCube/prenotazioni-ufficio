import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reserveData = req.body.id as string

  console.log('APPROVE',req.body)
  try {
    const updateUser = await prisma.reserve.update({
        where: {
          id: reserveData,
        },
        data: {
          status: 'accepted',
        },
      })

    res.status(200).json('ok')
  } catch(e) {
    console.log(e)
    res.status(404)
  }
}