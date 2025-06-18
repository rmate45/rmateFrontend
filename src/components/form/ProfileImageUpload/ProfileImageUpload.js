"use client";

import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const ProfileImageUpload = ({
  imagePreview,
  setImagePreview,
  setImageFile,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative mb-4 max-w-46 w-full">
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt="profile"
          width={100}
          height={100}
          className="object-cover min-h-46 max-h-46 rounded-3xl w-full border border-dark"
        />
      ) : (
        <div className="bg-[#E19CED] rounded-3xl min-h-46 h-full flex items-center justify-center overflow-hidden">
          <Image
            src="/profile.svg"
            alt="profile"
            width={72}
            height={72}
            className="object-cover mx-auto"
          />
        </div>
      )}

      <div
        className="absolute -bottom-3 -right-2 cursor-pointer"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <Image
          src="/profile-camera.svg"
          alt="profile-camera"
          width={65}
          height={65}
          className="object-cover"
        />
      </div>

      <input
        id="fileInput"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

ProfileImageUpload.propTypes = {
  imagePreview: PropTypes.string,
  setImagePreview: PropTypes.func.isRequired,
  setImageFile: PropTypes.func.isRequired,
};

export default ProfileImageUpload;
