import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/forgot-password", "/create-new-password"]; // accessible to both logged-in and logged-out users

const GUEST_ONLY_ROUTES = ["/login", "/set-new-password"]; // only accessible if NOT logged in

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isGuestOnly = GUEST_ONLY_ROUTES.includes(pathname);

  if (!token && !isPublic && !isGuestOnly) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isGuestOnly) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // exclude static files and _next
};
