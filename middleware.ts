import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session;

  if (
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/orders")
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    return NextResponse.next();
  } else if (nextUrl.pathname.startsWith("/admin")) {
    const role = (session?.user as any)?.role;
    if (role !== "admin" && role !== "employee") {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*"],
};
