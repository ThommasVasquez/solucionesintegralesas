import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "desarrollo-secret-123",
  session: { strategy: "jwt" },
  providers: [], 
  callbacks: {
    async signIn({ user }) {
      if (user) {
        try {
          const { logActionServer } = await import("./audit-server");
          await logActionServer({
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            action: 'LOGIN',
            resource: 'SESSION',
            details: { message: `Usuario ${user.name} inició sesión.` }
          });
        } catch (e) {
          console.error("Error logging sign in:", e);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
