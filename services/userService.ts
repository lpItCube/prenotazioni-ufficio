import { User } from "next-auth";
import prisma from "../lib/prisma";
import { comparePwd } from "../utils/hashPassword";

const signInCredentials = async (email: string, password: string): Promise<User> => {

  enum Role {
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
  }

  const user = await prisma.user.findFirstOrThrow({
    where: { username: email }
  })

  const isSamePwd = await comparePwd(password, user.password)

  if (!user) {
    throw new Error("Invalid email");
  }

  if (!isSamePwd) {
    throw new Error("Invalid password")
  }
  
  return {
    id: user.id,
    name: user.username,
    email: user.id+user.username,
    domainId: user.domainId,
    role: Role[user.role]
  }
}

export default signInCredentials