"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const BreadcrumbNew = ({
    userAccessLevel = "",
    paths = [],
    showBackButton = true,
    onBackClick,
    customIcons = {
        back: "/arrow-back.svg",
        separator: "/right-point.svg"
    }
}) => {
    const pathname = usePathname();

    // Handle back button click
    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            window.history.back();
        }
    };

    // Construct breadcrumb items
    const breadcrumbItems = [
        { label: userAccessLevel, path: `/${userAccessLevel.toLowerCase()}`, active: false },
        ...paths.map((path, index) => ({
            label: path.label,
            path: path.path || `/${userAccessLevel.toLowerCase()}/${path.label.toLowerCase().replace(/\s+/g, '-')}`,
            active: index === paths.length - 1
        }))
    ];

    return (
        <div className="flex items-center breadcrumbs py-4">
            {showBackButton && (
                <div className="mr-5 cursor-pointer" onClick={handleBackClick}>
                    <Image width={24} height={24} alt="back" src={customIcons.back} />
                </div>
            )}

            <div className="flex items-center flex-wrap">
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <Image
                                width={16}
                                height={16}
                                alt="separator"
                                src={customIcons.separator}
                                className="mx-3"
                            />
                        )}

                        {item.active ? (
                            <p className="font-semibold text-subheadline text-base">
                                {item.label}
                            </p>
                        ) : (
                            <Link href={item.path}>
                                <p className="font-normal text-[#343434] text-base hover:underline cursor-pointer">
                                    {item.label}
                                </p>
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default BreadcrumbNew;