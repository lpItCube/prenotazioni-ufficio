import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

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
  const usernameOrId = req.query.username as string

  if (req.method === "GET") {
    try {
      const result = await prisma.user.findUnique({
        where: { username: usernameOrId }
      })
      res.status(200).json(result)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }

  if (req.method === "PUT") {
    const data = req.body
    try {
      const result = await prisma.user.update({
        where: { id: usernameOrId },
        data: { role: data.user }
      })
      res.status(200).json(result)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }

}
