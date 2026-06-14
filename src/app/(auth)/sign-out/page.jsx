"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logout from "@/app/actions/Logout";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await Logout();
      router.push("/");
    };
    handleLogout();
  }, [router]);

  return null;
}
