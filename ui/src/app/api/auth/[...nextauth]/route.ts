import NextAuth from "next-auth";
import AuthentikProvider from "next-auth/providers/authentik";

const handler = NextAuth({
  providers: [
    AuthentikProvider({
      clientId: process.env.AUTHENTIK_CLIENT_ID as string,
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET as string,
      issuer: process.env.AUTHENTIK_ISSUER as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Save the id_token and access_token to the JWT so they can be passed to the session
        token.id_token = account.id_token;
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Expose the tokens cleanly to the frontend Session
      if (token) {
        session.id_token = token.id_token;
        session.access_token = token.access_token;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev", 
});

export { handler as GET, handler as POST };
