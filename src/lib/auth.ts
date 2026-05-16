import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

// SISTEMA DE USUARIOS SIMPLIFICADO (Sin base de datos)
const USERS = [
  {
    id: "1",
    email: "patron@energysoft.com",
    password: "patron1234",
    name: "El Patron",
    role: "PATRON"
  },
  {
    id: "2",
    email: "admin@energysoft.com",
    password: "admin1234",
    name: "Administrador",
    role: "ADMIN"
  },
  {
    id: "3",
    email: "tecnico@energysoft.com",
    password: "tecnico1234",
    name: "Técnico de Campo",
    role: "TECNICO"
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
  session: { strategy: "jwt" },
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
