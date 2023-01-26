import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reserveId = req.query.reserveId as string

  try {

    const findToDelete = await prisma.reserve.findUnique({
      where: {id: reserveId}
    })


    if(!findToDelete) return res.status(204).json({message:'Ricarica la pagina.'})

    const result = await prisma.reserve.delete({
      where: { id: reserveId }
    })

    res.status(200).json(result)
  } catch(e) {
    res.status(404)
  }
}