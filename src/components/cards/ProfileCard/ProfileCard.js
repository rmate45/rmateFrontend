"use client";

import Image from "next/image";

export default function ProfileCard({
  name,
  employeeId,
  imageUrl,
  address,
  phone,
  email,
  role = "admin",
  properties = null,
  onEdit = () => {},
  onCopy = () => {},
  isEditable = true
}) {
  return (
    <div className="bg-white rounded-lg max-w-65 w-full shadow-sm relative">
      <div className="bg-primary w-full h-[120px] rounded-md absolute"></div>

      <div className="flex flex-col items-center p-4">
        {/* Profile Image */}
        <div className="relative w-full">
          <Image
            src={imageUrl}
            alt="Profile picture"
            className="rounded-4xl max-h-[220px] object-cover w-full"
            width={200}
            height={200}
          />
        </div>

        {/* Name and ID */}
        <div className="mt-2 w-full text-left">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold text-dark poppins mt-2">
              {name}
            </h2>
            {isEditable && (
              <Image
                src="/profile_edit.svg"
                alt="Edit profile"
                width={24}
                height={24}
                className="cursor-pointer mb-2"
                onClick={onEdit}
              />
            )}
          </div>
          <div className="flex items-center mt-[10px] text-subheadline">
            <span className="text-sm font-medium">{employeeId}</span>
            <Image
              src="/copy.svg"
              alt="Copy"
              width={16}
              height={16}
              className="ml-2 cursor-pointer"
              onClick={onCopy}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-3 w-full space-y-[10px] text-subheadline">
          {address && (
            <div className="flex items-center">
              <Image
                src="/location.svg"
                alt="Location"
                width={20}
                height={20}
                className="mr-2"
              />
              <span className="text-sm">{address}</span>
            </div>
          )}
          <div className="flex items-center">
            <Image
              src="/phone.svg"
              alt="Phone"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-sm">{phone}</span>
          </div>
          <div className="flex items-center">
            <Image
              src="/mail.svg"
              alt="Mail"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-sm">{email}</span>
          </div>
          {role === "owner" && properties != null && (
            <div className="flex items-center">
              <Image
                src="/properties-dark.svg"
                alt="properties"
                width={20}
                height={20}
                className="mr-2"
              />
              <span className="text-sm">Properties - {properties}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
