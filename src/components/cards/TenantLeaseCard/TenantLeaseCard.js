import React from "react";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";

const TenantLeaseCard = ({
  tenantName,
  tenantId,
  tenantImage,
  numOfTenants,
  leaseDuration,
  leaseStart,
  leaseEnd,
  securityDeposit,
  onEdit,
  onRelease,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-3 shadow-sm poppins text-sm w-full max-w-sm">
      {/* Header */}
      <div className="flex gap-1 items-center mb-2">
        <h2 className="text-lg font-medium text-black">Tenant Lease Card</h2>
        <Image
          src="/profile_edit.svg"
          alt="edit"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={onEdit}
        />
      </div>

      {/* Tenant Info */}
      <div className="flex items-center gap-3">
        <Image
          src={tenantImage || ""}
          alt={tenantName}
          width={32}
          height={32}
          className="rounded-full object-cover w-10 h-10"
        />
        <div className="flex gap-2 font-medium text-black">
          <div className="text-sm">{tenantName}</div>
          <div className="flex items-center gap-1 text-xs text-subheadline">
            {tenantId}
            <Image
              src="/copy.svg"
              alt="copy"
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Lease Info */}
      <div className="text-xs">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-black text-sm font-medium">
            Number of tenants -
          </span>
          <span className="font-normal text-xs text-black">{numOfTenants}</span>
        </div>

        <div className="flex items-center justify-between mb-1 gap-1">
          <span className="text-black text-sm font-medium">Lease –</span>
          <div className="text-right flex justify-between flex-1">
            <div className="font-normal text-xs text-black">{leaseDuration}</div>
            <div className="font-normal text-xs text-black">
              {leaseStart} – {leaseEnd}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-black text-sm font-medium">
            Security Deposit –
          </span>
          <span className="font-normal text-xs text-black">${securityDeposit}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="max-w-2/3 ml-auto">
        <Button title=" – Release tenant" onClick={onRelease} size="sm" />
      </div>
    </div>
  );
};

export default TenantLeaseCard;
