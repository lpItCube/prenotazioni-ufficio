import jwt from "jsonwebtoken"

export const generateToken = (userId: string, email: string) => {
  const payload = {
    userId: userId,
    email: email
  }

  const secretKey = process.env.TKN_SECRET_KEY
  return jwt.sign(payload, secretKey!, { expiresIn: '1h' })
}