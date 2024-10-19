import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  callbacks: {
    authorized: ({ token }) => {
      // If there is a token, the user is authenticated
      return !!token;
    },
  },
  // Add custom behavior for redirecting authenticated users
  // async middleware(req) {
  //   const { pathname } = req.nextUrl;
  //   const token =
  //     req.cookies.get("next-auth.session-token") ||
  //     req.cookies.get("__Secure-next-auth.session-token");

  //   // If user is logged in and tries to access login/signup, redirect to homepage or dashboard
  //   if (token && (pathname === "/login" || pathname === "/signup")) {
  //     return NextResponse.redirect(new URL("/", req.url)); // Redirect to homepage
  //   }

  //   // Otherwise, let the middleware run as usual
  //   return NextResponse.next();
  // },
});

export const config = {
  matcher: ["/", "/profile", "/login", "/signup"],
};
