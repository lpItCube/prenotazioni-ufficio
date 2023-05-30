import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  type Data = {
    id: string
    name: string,
    description: string | null,
    officeId: string
    gridPoints: any
    xSize: number
    ySize: number
  }
  
  if (req.method === "GET") {
    try {
      const offices = await prisma.room.findMany({

      })
      res.status(200).json(offices)
    } catch(e) {
      console.log(e)
      res.status(404)
    }
  }
  
  if (req.method === "POST") {
    const body: Data = req.body
    try {
      const room = await prisma.room.create({
        data: { ...body }
      })
      res.status(200).json(room)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }

  if (req.method === "PUT") {
    const body: Data = req.body
    try {
      const room = await prisma.room.update({
        where: { id: body.id },
        data: {
          name: body.name,
          description: body.description, 
          gridPoints: body.gridPoints,
          xSize: body.xSize,
          ySize: body.ySize
        }
      })
      res.status(200).json(room)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }
  
}