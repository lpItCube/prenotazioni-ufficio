import { User } from "next-auth";
import prisma from "../lib/prisma";

const signInCredentials = async (email: string, password: string): Promise<User> => {

  enum Role {
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
  }

  const user = await prisma.user.findFirstOrThrow({
    where: { username: email, password: password }
  })

  if (!user) {
    throw new Error("Invalid email or password");
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