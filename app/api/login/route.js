import { NextResponse } from "next/server";

export async function POST(req) {
  const { user, pass } = await req.json();

  if (user === process.env.AUTH_USER && pass === process.env.AUTH_PASS) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("session", "active", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res;
  }

  return new Response("Invalid credentials", { status: 401 });
}
