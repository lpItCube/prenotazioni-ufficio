import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

enum Role {
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
  USER = "USER"
}

type User = {
  username: string,
  password: string,
  role: Role,
  domainId: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: User = req.body
 
  if (req.method === "POST") {
    try {
      const result = await prisma.user.create({
        data: { ...data },
      })
      res.status(200).json(result)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }

}