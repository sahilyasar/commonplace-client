import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/add-form/:path*", "/my-events/:path*", "/joined-events/:path*"],
};
