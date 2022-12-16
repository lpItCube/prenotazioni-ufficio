import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { from, to } = req.query
  console.log(from)
  console.log(to)
  try {
    const reserveData = await prisma.reserve.findMany({
      include: {
        seat: true,
        user: true
      },
      where:{
        NOT:{
          OR:[
              {
                from:{
                    gte: new Date(to as string)
                }
              },
              {
                to:{
                    lte: new Date(from as string)
                }
              }
          ]
        }
      }
    })
    res.status(200).json(reserveData)
  } catch (e) {
    console.log(e)
    res.status(404)
  }
}