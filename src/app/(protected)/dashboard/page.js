"use client";
import React, { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import { jwtDecode } from "@/helpers/AccessControlUtils";
import OwnerDashboard from "./components/OwnerDashboard";
import TenantDashboard from "./components/TenantDashboard";
import Cookies from "js-cookie";

const Page = () => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const token = Cookies.get("authToken"); // or read from cookies
    if (token) {
      setDecodedToken(jwtDecode(token));
    }
  }, []);

  switch (decodedToken?.rl) {
    case "admin":
      return <AdminDashboard />;
    case "sub admin":
      return <AdminDashboard />;
    case "owner":
      return <OwnerDashboard id={decodedToken?.id} />;
    case "tenant":
      return <TenantDashboard id={decodedToken?.id} />;
    default:
      return (
        <div className="flex justify-center items-center h-64">Loading...</div>
      );
  }
};

export default Page;
