"use client";

import { checkPermission } from "@/helpers/AccessControlUtils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const isAllowed = checkPermission("owner", "r");
    if (!isAllowed) {
      router.push("/unauthorized");
    } else {
      setHasPermission(true);
    }
  }, [router]);

  if (hasPermission === null) {
    return null; // Or a loader if you want to show a spinner
  }

  return <div>{children}</div>;
};

export default Layout;
