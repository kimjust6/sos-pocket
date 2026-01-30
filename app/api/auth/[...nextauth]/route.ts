import { IUsersDB, sampleUser } from "@/app/common/data/interfaces";
import {
  getOauthUser,
  loginUser,
  registerUser,
} from "@/app/common/services/auth.service";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

const SECRET_KEY = process.env.NEXTAUTH_SECRET as string;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
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
        // Add logic here to look up the user from the credentials supplied
        const response = await loginUser(
          credentials?.email ?? "",
          credentials?.password ?? ""
        );
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
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  // secret for jwt
  secret: SECRET_KEY,
  // debug options
  // debug: process.env.NODE_ENV === "development",
  events: {
    // async createUser(message) {
    // },
  },
  callbacks: {
    async signIn({ account, profile, user }: any) {
      let userData: IUsersDB = sampleUser;
      if (account.provider === "credentials") {
        // userData = {
        //     email: user?.email,
        //     image: user?.image,
        //     fName: user?.fName,
        //     lName: user?.lName,
        //     role: "user",
        //     orders: [],
        //     phone: null,
        //     forgotPasswordToken: null,
        //     forgotPasswordTokenExpiration: null,
        //     verifyToken: null,
        //     verifyTokenExpiration: null,
        //     isVerified: profile?.verified,
        //     provider: "email",
        //     tocAccepted: false,
        // };
        return true;
        // initialize user data from google
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
        // initialize user data from discord
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
      // call db and check if user exists, if not, create user and return true
      // user = userData;
      // profile.fName = profile?.username,
      // lName: profile?.global_name,
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

    session: ({ session, token, user }) => {
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
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user && account) {
        const u = user as unknown as any;
        const acc = account as unknown as any;
        try {
          const value = await getOauthUser(u.email, acc.provider);
          if (value?.status == "ok") {
            const nice = {
              ...token,
              id: u.id,
              fName: value.data.fName,
              lName: value.data.lName,
              name: value.data.name,
              role: value.data.role,
              token: value.data.token,
              provider: acc.provider,
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
