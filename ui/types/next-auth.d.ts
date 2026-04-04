import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id_token?: string;
    access_token?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
