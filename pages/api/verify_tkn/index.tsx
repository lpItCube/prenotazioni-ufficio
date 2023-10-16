import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } : any = req.body
  const secretKey = process.env.TKN_SECRET_KEY
  
  if (req.method === "POST") {
    try {
      const verifiedTkn = jwt.verify(token, secretKey!)
      console.log("Verified Token:", verifiedTkn)
      res.status(200).json(verifiedTkn)
    } catch (error) {
      console.log(error)
      res.status(404).json("Token not valid")
    }
  }
}