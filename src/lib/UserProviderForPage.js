"use server"
// lib/auth.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function UserProviderForPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // userid, email, etc.
  } catch (err) {
    return null;
  }
}

export default UserProviderForPage