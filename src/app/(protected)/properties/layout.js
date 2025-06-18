"use client";

import { checkPermission } from "@/helpers/AccessControlUtils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const isAllowed = checkPermission("properties", "r");
    if (!isAllowed) {
      router.push("/unauthorized");
    } else {
      setHasPermission(true);
    }
  }, [router]);

  // Don't render anything until permission is confirmed
  if (hasPermission === null) {
    return null; // or a loading spinner
  }

  return <div>{children}</div>;
};

export default Layout;
