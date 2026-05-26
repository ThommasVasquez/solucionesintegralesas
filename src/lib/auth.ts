import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const USERS = [
  {
    id: "1",
    email: "sebastian@ingenova.com.co",
    password: "Sebastian1*.",
    name: "Sebastián",
    role: "BOSS",
  },
  {
    id: "2",
    email: "jessyca@ingenova.com.co",
    password: "Jessyca2*.",
    name: "Jessyca",
    role: "BOSS",
  },
  {
    id: "3",
    email: "adrian@ingenova.com.co",
    password: "Adrian3*.",
    name: "Adrian",
    role: "BOSS",
  },
  {
    id: "4",
    email: "sergio@ingenova.com.co",
    password: "Sergio4*.",
    name: "Sergio",
    role: "COORDINADOR",
  },
  {
    id: "5",
    email: "thommyenergy@superuser.com",
    password: "Md5891129Ae%ThommyEnergy%",
    name: "ThommyEnergy! ⚡️",
    role: "BOSS",
  },
  {
    id: "6",
    email: "rafael@ingenova.com.co",
    password: "Rafael2026*.",
    name: "Rafael",
    role: "COORDINADOR",
  },
  {
    id: "7",
    email: "kevin@ingenova.com.co",
    password: "Kevin2026*.",
    name: "Kevin",
    role: "COORDINADOR",
  },
  {
    id: "8",
    email: "agendadora1@ingenova.com.co",
    password: "Agendadora20261*.",
    name: "Agendadora 1",
    role: "AGENDADOR",
  },
  {
    id: "9",
    email: "agendadora2@ingenova.com.co",
    password: "Agendadora20262*.",
    name: "Agendadora 2",
    role: "AGENDADOR",
  },
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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Validación simple contra el array USERS
        const user = USERS.find((u) => u.email === credentials.email);

        if (!user || user.password !== credentials.password) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
