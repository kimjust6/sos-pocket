// without a defined matcher, this one line applies next-auth to the entire app
// export { default } from "next-auth/middleware";
// export const config = { matcher: ["/(admin/.*)", "/profile"] };

// custom middleware
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// middleware
export const middleware = async (req: NextRequest, event: any) => {
  // middleware for auth
  const session = await getToken({ req: req, secret: process.env.SECRET });
  if (
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/orders")
  ) {
    // This logic is only applied to /admin and /profile
    if (!session) {
      return NextResponse.redirect(
        new URL("/auth/login", req.nextUrl).toString()
      );
    }

    return NextResponse.next();
  } else if (req.nextUrl.pathname.startsWith("/admin")) {
    if (session?.role !== "admin" && session?.role !== "employee") {
      return NextResponse.redirect(
        new URL("/auth/login", req.nextUrl).toString()
      );
    }
  }
};
