"use server";

import { cookies } from "next/headers";

export function setAuthCookie(cookieName, cookieValue) {
  const cookieStore = cookies();
  cookieStore.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}
