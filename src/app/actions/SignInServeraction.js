"use server";
import { redirect } from "next/navigation";
import User from "../../../models/User";
import Mongoosedb from "../../lib/mongoose";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
import { cookies } from "next/headers";
import Budget from "../../../models/Budget";

// dotenv.config();
export async function SignInServeraction(formData) {
  await Mongoosedb();
  // console.log("on the server", formData)
  // console.log(formData.get("name"), formData.get("Email"), formData.get("Password"))
  let newuser = await new User({
    name: formData.get("name"),
    email: formData.get("Email"),
    password: formData.get("Password"),
    
  });
  // console.log("making")

  //JWT TOKEN
  await newuser.save();
  if (!newuser.budget) {
    let budget = new Budget({
      userId: newuser._id,
    });
    await budget.save();
    newuser.budget = budget._id;
    await newuser.save();
  }
  // console.log(newuser)
  let token = jwt.sign(
    { userid: newuser._id, theme: newuser.Theme },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // const cookieStore = cookies();

  // 2. Set the secure cookie
  const cookieStore = await cookies();
  cookieStore.set("Token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
  // return { success: true, message: "User signed in successfully" };
}
