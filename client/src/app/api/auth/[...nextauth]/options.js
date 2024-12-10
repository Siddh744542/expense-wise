import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";
export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/users/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        return false;
      }
    })
  ],
  pages: {
    signIn: "/login",
    signUp: "/signup"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.user._id,
          username: user.user.username,
          email: user.user.email
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  },
  session: {
    strategy: "jwt"
  }
};
