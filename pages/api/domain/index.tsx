import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  type Data = {
    name: string
  }
  
  if (req.method === "GET") {
    try {
      const domains = await prisma.domain.findMany({
        // include: {
        //   office: true
        // }
        include: {
          office: {
            include: { room: true }
          },
          user: true
        }
      })
      res.status(200).json(domains)
    } catch(e) {
      console.log(e)
      res.status(404)
    }
  }
  
  if (req.method === "POST") {
    const body: Data = req.body
    try {
      const domain = await prisma.domain.create({
        data: { ...body }
      })
      res.status(200).json(domain)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }
  
}