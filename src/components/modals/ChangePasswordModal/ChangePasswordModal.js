"use client";

import React from "react";
import LabeledInput from "../../form/LabeledInput/LabeledInput";
import Button from "../../shared/Button/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useChangePasswordMutation } from "@/apis/auth/authApi";
import { jwtDecode } from "@/helpers/AccessControlUtils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Validation schema
const schema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please re-enter your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const ChangePasswordModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const decoded = jwtDecode();
      const userId = decoded?.id;

      if (!userId) throw new Error("User not authenticated");

      await changePassword({
        id: userId,
        data: {
          old_password: data.oldPassword,
          new_password: data.newPassword,
          new_password_confirmation: data.confirmPassword,
        },
      }).unwrap();

      router.push("/login");
      Cookies.remove("authToken");
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-10/12 mx-auto"
    >
      <h2 className="text-[#313131] font-bold text-5xl">
        Change Your Password
      </h2>
      <p className="text-[#313131] font-normal text-lg text-left max-w-[500px]">
        Keep your account secure by updating your password regularly.
      </p>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[#718096] poppins text-base font-normal block">
              Old Password
            </label>
            <Link
              href="/forgot-password"
              className="text-primary text-sm font-medium underline"
            >
              Forgot Password?
            </Link>
          </div>
          <LabeledInput
            label=""
            type="password"
            placeholder="Enter your old password"
            {...register("oldPassword")}
            error={errors.oldPassword}
          />
        </div>

        <LabeledInput
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          {...register("newPassword")}
          error={errors.newPassword}
        />

        <LabeledInput
          label="Re-Enter Password"
          type="password"
          placeholder="Re-enter your new password"
          {...register("confirmPassword")}
          error={errors.confirmPassword}
        />

        <Button
          title="Confirm"
          type="submit"
          className="w-full"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default ChangePasswordModal;
