import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.name as string;
        const password = credentials?.password as string;

        if (!username || !password) {
          return null;
        }
        const res = await api.post("https://salles.hemu-cl.ch/", {
          lieu: "ejma",
          utilisateur: username,
          mdp: password,
          connecter: "valider"
        });
        if (res.data.includes("S'identifier en tant qu'utilisateur EJMA")) return null
        const setCookieHeader = res.headers['set-cookie'];
        if (setCookieHeader) {
          const cookie = setCookieHeader[0].split(";")[0]
          return {
            id: username,
            phpCookie: cookie
          };
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phpCookie = user.phpCookie;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.phpCookie) {
        session.phpCookie = token.phpCookie;
      }
      return session;
    }
  },
  session: {
    maxAge: 5000,
  }
});
