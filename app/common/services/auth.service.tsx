"use server";

import { getProviders } from "next-auth/react";
import { IUsersDB } from "@/app/common/data/interfaces";

const BASE_URL = process.env.API_BASE_URL + "api/v1/";

/**
 * @name getAllUsers
 * @description gets all users from express backend excluding password hashes
 * @returns array of resole order objects
 */
export async function getAllUsers() {
  // api call to node.js backend from next.js server side
  try {
    const response = await fetch(BASE_URL + "auth/users/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * @name registerUser
 * @description register a user on the backend
 * @param userData
 * @returns
 */
export async function registerUser(userData: any) {
  let user: IUsersDB = {
    email: userData?.email,
    password: userData?.password1 ?? userData?.password,
    image: userData?.image ?? null,
    fName: userData?.fName,
    lName: userData?.lName,
    role: "user",
    orders: [],
    phone: null,
    forgotPasswordToken: null,
    forgotPasswordTokenExpiration: null,
    verifyToken: null,
    verifyTokenExpiration: null,
    isVerified: false,
    provider: userData.provider,
    tocAccepted: userData.tocAccepted,
  };

  try {
    const response = await fetch(BASE_URL + "auth/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * @name loginUser
 * @description get user data
 * @param userData
 * @returns
 */
export async function loginUser(userEmail: string, userPassword: string) {
  try {
    const response = await fetch(BASE_URL + "auth/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
        provider: "credentials",
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * @name getOauthUser
 * @description get oauth user data
 * @param userData
 * @returns
 */
export async function getOauthUser(userEmail: string, provider: string) {
  try {
    const response = await fetch(
      BASE_URL +
        "auth/users/session?" +
        new URLSearchParams({ email: userEmail, provider: provider }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": process.env.X_AUTH_TOKEN as string,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}
