import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserByEmail } from "./data/user"
import {nanoid} from "nanoid"
 
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
    },

    async jwt({token, user}) {
      const dbUser = await getUserByEmail(token.email as string);
      if(!dbUser) {
        token.id = user!.id as string
        return token
      }

      if(!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10)
          }
        })
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username
      }
    },
    redirect() {
      return '/'
    }
  }
})