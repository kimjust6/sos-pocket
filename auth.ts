import { IUsersDB, sampleUser } from "@/app/common/data/interfaces";
import {
  getOauthUser,
  loginUser,
  registerUser,
} from "@/app/common/services/auth.service";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

const SECRET_KEY = (process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET) as string;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const response = await loginUser(email ?? "", password ?? "");

        if (response?.status === "ok") {
          return response?.data;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-user",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  secret: SECRET_KEY,
  callbacks: {
    async signIn({ account, profile, user }: any) {
      let userData: IUsersDB = sampleUser;
      if (account.provider === "credentials") {
        return true;
      } else if (account.provider === "google") {
        userData = {
          email: profile.email,
          password: "oauth",
          image: user?.image ?? profile?.picture,
          fName: profile?.given_name,
          lName: profile?.family_name,
          role: "user",
          orders: [],
          phone: null,
          forgotPasswordToken: null,
          forgotPasswordTokenExpiration: null,
          verifyToken: null,
          verifyTokenExpiration: null,
          isVerified: profile?.email_verified,
          provider: "google",
          tocAccepted: false,
        };
      } else if (account.provider === "discord") {
        userData = {
          email: profile.email,
          password: "oauth",
          image: profile?.image_url,
          fName: profile?.username,
          lName: profile?.global_name,
          role: "user",
          orders: [],
          phone: null,
          forgotPasswordToken: null,
          forgotPasswordTokenExpiration: null,
          verifyToken: null,
          verifyTokenExpiration: null,
          isVerified: profile?.verified,
          provider: "discord",
          tocAccepted: false,
        };
      }
      try {
        const response = await registerUser(userData);
        if (
          response?.status === "ok" ||
          response?.error?.message.includes("already exists.")
        ) {
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        console.error("failed to create account " + error?.message);
        return false;
      }
    },
    session: ({ session, token }: any) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token._id,
            fName: token.fName,
            lName: token.lName,
            role: token.role,
            token: token.token,
            name: `${token.fName} ${token.lName}`,
            provider: token.provider,
          },
        };
      } else {
        return session;
      }
    },
    jwt: async ({ token, user, account }: any) => {
      if (user && account) {
        try {
          // Note: using user.email here. ensure typings or casting.
          const value = await getOauthUser(user.email, account.provider);
          if (value?.status == "ok") {
            const nice = {
              ...token,
              id: user.id,
              fName: value.data.fName,
              lName: value.data.lName,
              name: value.data.name,
              role: value.data.role,
              token: value.data.token,
              provider: account.provider,
            };
            return nice;
          }
        } catch (error) {
          console.error(error);
        }
      }
      return token;
    },
  },
});
