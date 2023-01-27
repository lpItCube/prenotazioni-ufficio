import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { currentUser, method }:any = req.query

  if(method === 'myUser') {
    try {
      const reserveData = await prisma.reserve.findMany({
        include: {
          seat: true,
          user: true
        },
        where: {
          userId: currentUser
        }
      })
      
      res.status(200).json(reserveData)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  } else if(method === 'otherUsers') {
    try {
      const reserveData = await prisma.reserve.findMany({
        include: {
          seat: true,
          user: true
        },
        where: {
          NOT: {
            userId:currentUser
          }
        }
      })
      
      res.status(200).json(reserveData)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  } else {
    try {
      const reserveData = await prisma.reserve.findMany({
        include: {
          seat: true,
          user: true
        }
      })
      
      res.status(200).json(reserveData)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }
}