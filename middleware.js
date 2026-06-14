// middleware.js
import { NextResponse } from "next/server";

export const runtime = 'edge'; //
export default function middleware(request) {
  console.log(" Middleware is running!");

  const token = request.cookies.get("Token")?.value;
  console.log("Middleware → Token:", token);

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};