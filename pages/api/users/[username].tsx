import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = req.query.username as string

  try {
    const result = await prisma.user.findUnique({
      where: { username: username }
    })
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(404)
  }
}
