import { NextResponse } from "next/server";

export function middleware(req) {
  const auth = req.headers.get("authorization");

  const validUser = "me";
  const validPass = process.env.WEBPAGE_PASS;

  console.log(validPass, "valid pass");

  if (auth) {
    const base64 = auth.split(" ")[1];
    const [user, pass] = atob(base64).split(":");

    if (user === validUser && pass === validPass) {
      return NextResponse.next();
    }
  }

  return new Response("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"], // protect all pages
};
