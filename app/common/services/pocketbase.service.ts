import PocketBase from "pocketbase";
import { TypedPocketBase } from "@/pocketbase-types";

// PocketBase URL - uses PB_TYPEGEN_URL (server-side) or NEXT_PUBLIC_POCKETBASE_URL (client-side)
const POCKETBASE_URL =
  process.env.PB_TYPEGEN_URL ||
  process.env.NEXT_PUBLIC_POCKETBASE_URL ||
  "https://sos-be.jkim.win";

// Create a singleton PocketBase instance
let pb: TypedPocketBase | null = null;

/**
 * Get the PocketBase client instance (singleton pattern)
 */
export function getPocketBase(): TypedPocketBase {
  if (!pb) {
    pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;
  }
  return pb;
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  const client = getPocketBase();
  return client.authStore.isValid;
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser() {
  const client = getPocketBase();
  return client.authStore.record;
}

/**
 * Get the current auth token
 */
export function getAuthToken(): string | null {
  const client = getPocketBase();
  return client.authStore.token || null;
}

// Helper to set the auth cookie
function setAuthCookie(token: string, model: any) {
  // Create a valid cookie string
  // Note: model needs to be stringified for valid export to cookie if needed,
  // but typically we just need the token or the export of the store.
  // PocketBase's exportToCookie() is the easiest way if we had the store instance and wanted to use it directly,
  // but here we are on the client side.
  // We'll mimic what PocketBase expects or just save the token/model structure middleware expects.

  // Actually, the easiest way to make the middleware's loadFromCookie work
  // is to save the entire store state.
  const client = getPocketBase();
  const cookieStr = client.authStore.exportToCookie({ httpOnly: false });
  document.cookie = cookieStr;
}

// Helper to remove the auth cookie
function removeAuthCookie() {
  document.cookie = "pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Login with email and password
 * If user doesn't exist, creates account automatically then logs in
 */
export async function loginWithEmail(email: string, password: string) {
  const client = getPocketBase();
  try {
    const authData = await client
      .collection("users")
      .authWithPassword(email, password);
    setAuthCookie(client.authStore.token, client.authStore.model);
    return { success: true, data: authData };
  } catch (error: any) {
    // If login failed, try to create account and login
    if (
      error?.status === 400 ||
      error?.message?.includes("Failed to authenticate")
    ) {
      try {
        // Create the account
        await client.collection("users").create({
          email,
          password,
          passwordConfirm: password,
          emailVisibility: true,
        });
        // Now login with the new account
        const authData = await client
          .collection("users")
          .authWithPassword(email, password);
        setAuthCookie(client.authStore.token, client.authStore.model);
        return { success: true, data: authData, isNewUser: true };
      } catch (createError: any) {
        // If creation also fails (e.g., email already exists but wrong password)
        console.error("Account creation error:", createError);
        return {
          success: false,
          error: createError.message || "Invalid email or password",
        };
      }
    }
    console.error("Login error:", error);
    return { success: false, error: error.message || "Login failed" };
  }
}

/**
 * Start Google OAuth flow
 * This returns the auth URL and a code verifier for the PKCE flow
 */
export async function getGoogleAuthMethods() {
  const client = getPocketBase();
  try {
    const authMethods = await client.collection("users").listAuthMethods();
    const googleProvider = authMethods.oauth2?.providers?.find(
      (provider) => provider.name === "google"
    );
    return googleProvider || null;
  } catch (error: any) {
    console.error("Error fetching auth methods:", error);
    return null;
  }
}

/**
 * Complete Google OAuth authentication
 * Call this after the user is redirected back from Google
 */
export async function authenticateWithGoogle(
  provider: string,
  code: string,
  codeVerifier: string,
  redirectUrl: string
) {
  const client = getPocketBase();
  try {
    const authData = await client
      .collection("users")
      .authWithOAuth2Code(provider, code, codeVerifier, redirectUrl);
    setAuthCookie(client.authStore.token, client.authStore.model);
    return { success: true, data: authData };
  } catch (error: any) {
    console.error("OAuth authentication error:", error);
    return {
      success: false,
      error: error.message || "OAuth authentication failed",
    };
  }
}

/**
 * Login with OAuth2 - opens popup for provider authentication
 * This is the simpler method using PocketBase's built-in popup flow
 */
export async function loginWithGoogle() {
  const client = getPocketBase();
  try {
    const authData = await client.collection("users").authWithOAuth2({
      provider: "google",
      createData: {
        emailVisibility: true,
      },
    });
    setAuthCookie(client.authStore.token, client.authStore.model);
    return { success: true, data: authData };
  } catch (error: any) {
    console.error("Google OAuth error:", error);
    return {
      success: false,
      error: error.message || "Google authentication failed",
    };
  }
}

/**
 * Logout the current user
 */
export function logout() {
  const client = getPocketBase();
  client.authStore.clear();
  removeAuthCookie();
}

/**
 * Register a new user with email and password
 */
export async function registerWithEmail(
  email: string,
  password: string,
  passwordConfirm: string,
  additionalData?: Record<string, any>
) {
  const client = getPocketBase();
  try {
    const record = await client.collection("users").create({
      email,
      password,
      passwordConfirm,
      emailVisibility: true,
      ...additionalData,
    });

    // Auto-login after registration
    await client.collection("users").authWithPassword(email, password);
    setAuthCookie(client.authStore.token, client.authStore.model);

    return { success: true, data: record };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || "Registration failed" };
  }
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(email: string) {
  const client = getPocketBase();
  try {
    await client.collection("users").requestPasswordReset(email);
    return { success: true };
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      error: error.message || "Password reset request failed",
    };
  }
}

/**
 * Confirm password reset with token
 */
export async function confirmPasswordReset(
  token: string,
  password: string,
  passwordConfirm: string
) {
  const client = getPocketBase();
  try {
    await client
      .collection("users")
      .confirmPasswordReset(token, password, passwordConfirm);
    return { success: true };
  } catch (error: any) {
    console.error("Password reset confirmation error:", error);
    return {
      success: false,
      error: error.message || "Password reset confirmation failed",
    };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (token: string, record: any) => void
) {
  const client = getPocketBase();
  return client.authStore.onChange(callback);
}

/**
 * Refresh the current auth token
 */
export async function refreshAuth() {
  const client = getPocketBase();
  try {
    const authData = await client.collection("users").authRefresh();
    setAuthCookie(client.authStore.token, client.authStore.model);
    return { success: true, data: authData };
  } catch (error: any) {
    console.error("Auth refresh error:", error);
    return { success: false, error: error.message || "Auth refresh failed" };
  }
}
