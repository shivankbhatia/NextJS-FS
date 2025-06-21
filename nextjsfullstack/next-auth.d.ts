import NextAuth, { DefaultSession } from "next-auth";

declare module "nect-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}