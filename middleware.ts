import { NextRequest, NextResponse } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const pathname = request.nextUrl.pathname;

  if (!sessionToken && pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (sessionToken && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!.*\\..*|_next|users/api).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};

