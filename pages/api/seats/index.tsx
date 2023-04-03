import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  type Seat = {
    id: string
    name: string
    type: string
    roomId: string
  }
  
  // if (req.method === "GET") {
  //   try {
  //     const seats = await prisma.room.findMany({

  //     })
  //     res.status(200).json(offices)
  //   } catch(e) {
  //     console.log(e)
  //     res.status(404)
  //   }
  // }
  console.log('REQ MET',req.body)
  if (req.method === "POST") {
    const body: Seat[] = req.body.seats
    try {
      const seats = await prisma.seat.createMany({
        data: [...body]
      })
      res.status(200).json(seats)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }
  
}