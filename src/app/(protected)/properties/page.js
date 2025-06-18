"use client";

import PropertiesLayout from "@/components/layout/PropertiesLayout/PropertiesLayout";
import Button from "@/components/shared/Button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center p-4 justify-between bg-white rounded-xl">
        <h2 className="text-dark font-semibold text-lg">Properties</h2>

        <div className="max-w-[250px]">
          <Link href={"/properties/add-property"} prefetch={true}>
            <Button
              title="Add New Property"
              iconSrc="/plus-white.svg"
              iconAlt="add"
              size="sm"
            />
          </Link>
        </div>
      </div>
      <PropertiesLayout
        onClickProperty={(propertyId) =>
          router.push(`/properties/${propertyId}`)
        }
        showAddButton={false}
        showTitle={false}
      />
    </div>
  );
};

export default Page;
