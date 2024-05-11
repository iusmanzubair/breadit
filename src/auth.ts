import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async session({token, session}) {
      if(token) {
        session.user.id = token.id
        session.user.email = token.email as string
        session.user.image = token.picture
        session.user.name = token.name
        session.user.username = token.username
      }

      return session;
    }

    async jwt({token, user}) {
      
    }
  }
})