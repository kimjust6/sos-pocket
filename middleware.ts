import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Initialize PocketBase with the cookie from the request
  const pb = new PocketBase(
    process.env.PB_TYPEGEN_URL || "https://sos-be.jkim.win"
  );
  const authCookie = request.cookies.get("pb_auth")?.value;

  if (authCookie) {
    pb.authStore.loadFromCookie(request.headers.get("cookie") || "");
  }

  const isLoggedIn = pb.authStore.isValid;
  const user = pb.authStore.model;

  // Protected routes
  if (
    nextUrl.pathname.startsWith("/account") ||
    nextUrl.pathname.startsWith("/orders")
  ) {
    if (!isLoggedIn) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Admin routes
  else if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check for admin/employee role
    // Note: Assuming 'role' field exists on user model
    const role = (user as any)?.role;
    if (role !== "admin" && role !== "employee") {
      // Redirect to home or unauthorized page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/orders/:path*"],
};
