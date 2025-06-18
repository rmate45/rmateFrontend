"use client";
import { checkPermission } from "@/helpers/AccessControlUtils";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const layout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!checkPermission("admin", "r")) {
        router.push("/unauthorized");
    }
  }, []);

  return <div>{children}</div>;
};

export default layout;
