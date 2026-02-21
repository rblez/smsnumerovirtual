import { NextResponse } from "next/server";

export function proxy() {
  // Admin is now a regular route, no subdomain routing needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|llms.txt).*)",
  ],
};
