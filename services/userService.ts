import { User } from "next-auth";

const signInCredentials = async (email: string, password: string): Promise<User> => {

  enum Role {
    USER = "user",
    ADMIN = "admin"
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
    role: Role[user.role]
  }
}

export default signInCredentials