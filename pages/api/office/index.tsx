import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  type Data = {
    id: string
    name: string
    domainId: string
  }
  
  if (req.method === "GET") {
    try {
      const offices = await prisma.office.findMany({
        include: {
          room: true
        }
      })
      console.log("OFFICES: ", offices)
      res.status(200).json(offices)
    } catch(e) {
      console.log(e)
      res.status(404)
    }
  }
  
  if (req.method === "POST") {
    const body: Data = req.body
    try {
      const office = await prisma.office.create({
        data: { ...body }
      })
      res.status(200).json(office)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }
  
}