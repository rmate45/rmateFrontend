"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Modal from "../Modal/Modal";
import ChangePasswordModal from "../../modals/ChangePasswordModal/ChangePasswordModal";
import { jwtDecode } from "@/helpers/AccessControlUtils";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const tokenData = jwtDecode(); // Safely runs only on client
    setDecodedToken(tokenData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full p-5 bg-white shadow flex justify-end items-center relative">
      <div className="flex items-center space-x-2 mr-4 relative">
        <div
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        >
          <Image
            className="rounded-full object-cover w-10 h-10"
            width={42}
            height={42}
            alt="profile"
            src="https://picsum.photos/id/237/200/300"
          />
        </div>

        <div className="text-left m-0">
          {decodedToken ? (
            <>
              <p className="font-normal text-dark">
                {decodedToken?.fn} {decodedToken?.ln}
              </p>
              <p className="text-sm font-normal text-[#848484]">
                {decodedToken?.rl}
              </p>
            </>
          ) : (
            <div className="w-20 h-4 bg-gray-100 animate-pulse rounded-sm" />
          )}
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-14 right-0 w-64 bg-white border border-[#E4E2E4] rounded-md shadow-lg p-4 z-50"
          >
            <div className="mb-3">
              <p className="text-sm font-normal text-[#848484] mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Image
                  src="/email-black.svg"
                  width={25}
                  height={25}
                  alt="email"
                />
                <span className="text-sm font-medium text-[#575757]">
                  {decodedToken?.em}
                </span>
              </div>
            </div>
            <hr className="my-2 text-[#939393] bg-[#939393]" />
            <div className="text-sm font-normal text-[#848484] mb-1">
              Change Password
            </div>
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-gray-100 py-2 rounded"
              onClick={() => setIsChangePassword(true)}
            >
              <div className="flex items-center gap-2">
                <Image src="/lock.svg" width={25} height={25} alt="lock" />
                <span className="text-sm font-medium text-[#575757]">
                  Change Password
                </span>
              </div>
              <span>
                <Image
                  src="/arrow-next.svg"
                  width={12}
                  height={12}
                  alt="arrow"
                />
              </span>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isChangePassword}
        onClose={() => setIsChangePassword(false)}
      >
        <ChangePasswordModal />
      </Modal>
    </header>
  );
}

export default Header;
