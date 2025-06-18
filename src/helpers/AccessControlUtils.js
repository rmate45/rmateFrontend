import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const jwtDecode = () => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      // Handle the case where no token exists
      return null; // or redirect, or throw an error, depending on your needs
    }
    const arrayToken = token.split(".");
    return JSON.parse(atob(arrayToken[1]));
  } catch (error) {
    // If Parsing token results in error means token is malformed and user must return to login screen
    console.error("Error decoding token:", error); // Log the error for debugging
    redirect("/login");
    return null; // Return null to prevent further errors
  }
};

export const isTokenExpired = () => {
  return jwtDecode()?.exp < Date.now() / 1000;
};

// helpers/AccessControlUtils.js
export const checkPermission = (permissionName, action, permissions = null) => {
  const allPermissions = permissions || jwtDecode()?.ps || [];
  const permission = allPermissions.find((p) => p.n === permissionName);
  if (!permission) return false;
  switch (action) {
    case "r":
      return !!permission.r;
    case "u":
      return !!permission.u;
    case "v":
      return !!permission.v;
    case "d":
      return !!permission.d;
    case "a":
      return !!permission.a;
    default:
      return false;
  }
};

export const getAllowedTabsByRole = (role) => {
  switch (role) {
    case "admin":
      return [
        "Receiving Area",
        "Ripening & Selection Area",
        "Processing & Cooking Area",
        "Packing Area",
      ];
    case "receiving manager":
      return ["Receiving Area"];
    case "ripening & selection manager":
      return ["Ripening & Selection Area"];
    case "processing cooking manager":
      return ["Processing & Cooking Area"];
    case "packing manager":
      return ["Packing Area"];
    default:
      return [];
  }
};
