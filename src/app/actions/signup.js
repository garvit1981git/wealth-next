"use server";

import Mongoosedb from "@/lib/mongoose";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

let SignUpServerAction = async (data) => {
  await Mongoosedb();
  // 2. Find the user by Email
  const user = await User.findOne({ password: data.Password, name: data.name });

  if (!user) {
    return { success: false, message: "User not found" };
  }
  let token = jwt.sign(
    { userid: user._id, theme: user.Theme || "dark" },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // const cookieStore = cookies();

  // 2. Set the secure cookie
  const cookieStore = await cookies();
  cookieStore.set("Token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // return { success: true, message: "User  found" };

  redirect("/dashboard");
};
export default SignUpServerAction;
