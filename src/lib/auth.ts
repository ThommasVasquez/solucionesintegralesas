import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

// SISTEMA DE USUARIOS SIMPLIFICADO (Sin base de datos)
const USERS = [
  {
    id: "1",
    email: "sebastian@ingenova.com.co",
    password: "Sebastian1*.",
    name: "Sebastián",
    role: "PATRON"
  },
  {
    id: "2",
    email: "jessyca@ingenova.com.co",
    password: "Jessyca2*.",
    name: "Jessyca",
    role: "ADMIN"
  },
  {
    id: "3",
    email: "adrian@ingenova.com.co",
    password: "Adrian3*.",
    name: "Adrian",
    role: "TECNICO"
  },
  {
    id: "4",
    email: "sergio@ingenova.com.co",
    password: "Sergio4*.",
    name: "Sergio",
    role: "ADMIN"
  }
];

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  
  interface User {
    role: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Validación simple contra el array USERS
        const user = USERS.find(u => u.email === credentials.email);

        if (!user || user.password !== credentials.password) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ]
});
