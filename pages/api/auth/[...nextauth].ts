import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import signInCredentials from "../../../services/userService";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET");
}

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
        const res = signInCredentials(email, password)
        return res
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/logout"
  },
  
  callbacks: {
    async jwt({ token, user } ) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.domainId = user.domainId
        token.role = user.role
        token.id = user.id
      }
      return token;
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.domainId = token.domainId
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
}

export default NextAuth(authOptions)