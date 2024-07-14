import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
 
export default auth((req) => {
    const isLoggedIn = !!req.auth

    if(!isLoggedIn) return Response.redirect(new URL('/sign-in', req.nextUrl))
})
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/r/:path*/submit", "/r/create"],
}