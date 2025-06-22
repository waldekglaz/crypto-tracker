import { NextResponse } from "next/server";

export function middleware(request) {
  const isLoggedIn = request.cookies.get("session")?.value === "active";

  if (!isLoggedIn && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|public).*)"],
};
