"use client";

import { checkPermission } from "@/helpers/AccessControlUtils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const isAllowed = checkPermission("tenant", "r");
    if (!isAllowed) {
      router.push("/unauthorized");
    } else {
      setHasPermission(true);
    }
  }, [router]);

  if (hasPermission === null) {
    return null; // or a spinner if you prefer
  }

  return <div>{children}</div>;
};

export default Layout;
