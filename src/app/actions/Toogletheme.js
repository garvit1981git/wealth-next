"use server";

import Mongoosedb from "@/lib/mongoose";
// Replace with your actual DB connection path
import { revalidatePath } from "next/cache";
import User from "../../../models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function Toggletheme(userId, nextTheme) {
  try {
    if (!userId) throw new Error("Unauthorized: Missing User ID");

    await Mongoosedb(); // Ensure DB connection

    // Persist directly using your exact schema key casing (Theme)
    await User.findByIdAndUpdate(
      userId,
      { Theme: nextTheme },
      { runValidators: true },
    );

    // Optional: Clears Next.js cache so layout updates everywhere immediately
    revalidatePath("/");

    const cookieStore = await cookies();
    const token = cookieStore.get("Token")?.value;

    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // userid, email, etc.
      delete decoded.iat;
      delete decoded.exp;

      // 2. Update the theme property inside the token payload
      const updatedPayload = {
        ...decoded,
        theme: nextTheme, // "light" or "dark"
      };
      const newToken = jwt.sign(updatedPayload, process.env.JWT_SECRET, {
        expiresIn: "7d", // Match your original expiration length
      });
      cookieStore.set({
        name: "Token",
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days matching expiration
      });

      // 5. UPDATE YOUR DATABASE HERE TOO
      // await User.findByIdAndUpdate(userId, { theme: nextTheme });

      // return { success: true, theme: nextTheme };
    } catch (err) {
      console.error("Error updating theme in token:", err);
    }
    return { success: true };
  } catch (error) {
    console.error("Server Action Error updating theme:", error);
    return { success: false, error: error.message };
  }
}
export default Toggletheme;
