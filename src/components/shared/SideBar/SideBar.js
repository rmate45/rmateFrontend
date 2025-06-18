"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { checkPermission, jwtDecode } from "@/helpers/AccessControlUtils";
import Cookies from "js-cookie";

const ROUTE_META = {
  dashboard: {
    label: "Dashboard",
    activeIcon: "dashboard-active.svg",
    inActiveIcon: "dashboard.svg",
    path: "dashboard",
  },
  admin: {
    label: "Admin",
    activeIcon: "admin-active.svg",
    inActiveIcon: "admin.svg",
    path: "admin",
  },
  owner: {
    label: "Owner",
    activeIcon: "owner-active.svg",
    inActiveIcon: "owner.svg",
    path: "owner",
  },
  tenant: {
    label: "Tenant",
    activeIcon: "tenant-active.svg",
    inActiveIcon: "tenant.svg",
    path: "tenant",
  },
  properties: {
    label: "Properties",
    activeIcon: "properties-active.svg",
    inActiveIcon: "properties.svg",
    path: "properties",
  },
  payments: {
    label: "Payment",
    activeIcon: "payment-active.svg",
    inActiveIcon: "payment.svg",
    path: "payments",
  },
  tickets: {
    label: "Tickets",
    activeIcon: "tickets-active.svg",
    inActiveIcon: "tickets.svg",
    path: "tickets",
  },
};

function Sidebar() {
  const pathname = usePathname();
  const currentPath = pathname;
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [links, setLinks] = useState([]);
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const filteredLinks = Object.keys(ROUTE_META)
      .filter((routeName) => checkPermission(routeName, "r"))
      .map((routeName) => ({
        path: routeName,
        ...ROUTE_META[routeName],
      }));

    const tokenData = jwtDecode();
    setDecodedToken(tokenData);

    setLinks(filteredLinks);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);

    Cookies.remove("authToken");
    router.push("/login");
  };

  return (
    <aside
      className={clsx(
        "w-72 bg-white shadow-xl p-6 flex flex-col h-screen poppins"
      )}
    >
      <Image
        src="/promex-logo-purple.svg"
        alt="promex"
        width={152}
        height={42}
        className="mb-8"
      />

      {links.length > 0 && (
        <ul className="space-y-1.5 mt-20">
          {links.map(({ label, activeIcon, inActiveIcon, path }) => {
            const fullPath = `/${path}`;
            const isActive =
              currentPath === fullPath ||
              currentPath.startsWith(`${fullPath}/`);

            return (
              <li key={label}>
                <Link href={fullPath} prefetch={true}>
                  <div
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors",
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Image
                      src={`/${isActive ? activeIcon : inActiveIcon}`}
                      alt={label}
                      width={24}
                      height={24}
                      className="transition"
                    />
                    <span
                      className={clsx(
                        "font-normal text-base ",
                        isActive ? "text-primary font-normal" : "text-[#64748B]"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center gap-2">
          <Image
            className="rounded-full object-cover w-8 h-8"
            width={32}
            height={32}
            alt="profile"
            src="https://picsum.photos/id/237/200/300"
          />
          <div>
            <h1 className="font-semibold text-[18px] text-dark">
              {decodedToken?.fn} {decodedToken?.ln}
            </h1>
            <p className="text-subheadline text-[10px]">{decodedToken?.em}</p>
          </div>
        </div>
        <div className="cursor-pointer" onClick={() => setShowModal(true)}>
          <Image width={24} height={24} alt="logout" src="/logout.svg" />
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Log Out</h1>
          <p className="mt-4 text-gray-600">
            Are you sure you want to log out?
          </p>
          <div className="flex justify-end mt-4 gap-5">
            <Button
              title="Cancel"
              variant="secondary"
              onClick={() => setShowModal(false)}
            />
            <Button
              title="Log Out"
              onClick={handleLogout}
              isLoading={isLoggingOut}
            />
          </div>
        </div>
      </Modal>
    </aside>
  );
}

export default Sidebar;
