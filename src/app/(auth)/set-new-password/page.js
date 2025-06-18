"use client";

import Button from "@/components/shared/Button/Button";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useResetPasswordMutation } from "@/apis/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/form/PasswordInput/PasswordInput";

const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const SetNewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword({
        email,
        token,
        password: data.password,
        password_confirmation: data.confirmPassword,
      }).unwrap();

      console.log("Password changed:", response);
      // Redirect to login or success page
      router.push("/login");
    } catch (error) {
      console.error("Failed to change password:", error);
      // Show toast or error UI
    }
  };

  return (
    <div className="bg-white m-auto flex flex-col max-w-[550px] w-full">
      <div>
        <h1 className="text-left text-dark text-[46px] font-bold leading-none">
          Set a New Password
        </h1>
        <p className="text-left text-[#8C99ACB8] italic text-[18px] font-normal mt-2.5">
          Create a new password. Ensure it differs from previous ones for
          security
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        <div className="mt-4 flex flex-col gap-4">
          <PasswordInput
            placeholder="Enter New Password"
            type="password"
            {...register("password")}
            error={errors.password}
          />
          <PasswordInput
            placeholder="Confirm New Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />
        </div>
        <div>
          <Button
            variant="primary"
            title="Get Started"
            type="submit"
            isLoading={isLoading}
            className="w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default SetNewPasswordPage;
