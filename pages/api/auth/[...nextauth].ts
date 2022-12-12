import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import prisma from "../../../lib/prisma"

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as { email: string, password: string}

        const res = await prisma.user.findFirstOrThrow({
           where: { username: email, password: password }
        })
        
        return { id: res.id, name: res.username }
      }
    })
  ],
  pages: {
    signIn: "/login"
  }
}

export default NextAuth(authOptions)