"use client";

import Button from "@/components/shared/Button/Button";
import Input from "@/components/form/Input/Input";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ROUTES } from "@/lib/routes";
import { useForgotPasswordMutation } from "@/apis/auth/authApi";
import { useRouter } from "next/navigation";
import { showToast } from "@/helpers/utils";

// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data).unwrap();
      router.push("/login")
      showToast("Password reset email sent successfully.", "success");
      console.log("Password reset email sent:", response);
      // You can show a toast or success message here
    } catch (err) {
      console.error("Error sending reset email:", err);
      // Show error message here
    }
  };

  return (
    <div className="bg-white m-auto flex flex-col max-w-[550px] w-full">
      <div>
        <h1 className="text-left text-dark text-[46px] font-bold leading-none">
          Forgot Password
        </h1>
        <p className="text-left text-[#8C99ACB8] italic text-[18px] font-normal mt-2.5">
          Please enter your email to reset the password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        <div className="mt-4">
          <Input
            placeholder="Enter email"
            type="email"
            {...register("email")}
            error={errors.email}
          />
        </div>
        <div>
          <Button variant="primary" title="Send" type="submit" className="w-full" isLoading={isLoading} />
        </div>
      </form>

      <h2 className="text-dark text-center text-base mt-8 font-semibold">
        Already have an account?{" "}
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="text-primary cursor-pointer underline"
        >
          Login
        </Link>
      </h2>
    </div>
  );
};

export default ForgotPasswordPage;
