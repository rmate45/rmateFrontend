"use client";

import Button from "@/components/shared/Button/Button";
import Input from "@/components/form/Input/Input";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLoginUserMutation } from "@/apis/auth/authApi";
import Cookies from "js-cookie"; // Add this import
import PasswordInput from "@/components/form/PasswordInput/PasswordInput";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const router = useRouter();
  const { t } = useTranslation();

  const onSubmit = async (data, e) => {

   e?.preventDefault();
   
    try {
      const result = await loginUser(data).unwrap();

      const token = result?.data?.token;
      if (token) {
        Cookies.set("authToken", token, { expires: 7 });
        router.push(ROUTES.PROTECTED.DASHBOARD);
      } else {
        console.error("Token not found in response:", result);
      }
    } catch (err) {
      console.error("Login failed:", err);
      // optional: use a toast or alert to show error to user
    }
  };

  return (
    <div className="bg-white m-auto flex flex-col max-w-[500px] w-full">
      <div className="">
        <h1 className="text-left text-dark text-[46px] font-bold leading-none">
          {t("welcome_message")}
        </h1>
        <p className="text-left text-[#8C99ACB8] italic text-[18px] font-normal mt-2.5">
          {t("management_description")}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        <div>
          <div className="mt-4 flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Enter email"
              autoComplete="current-email"
              {...register("email")}
              error={errors.email}
            />
            <PasswordInput
              type="password"
              placeholder="Enter Password"
              autoComplete="current-password"
              {...register("password")}
              error={errors.password}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex gap-2 items-center">
              {" "}
              <div className="inline-flex items-center">
                <label className="flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer h-5 w-5 cursor-pointer bg-[#8C99AC29] transition-all appearance-none rounded hover:shadow-sm border border-slate-300 checked:bg-primary checked:border-primary"
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Image
                      src="/checkbox.svg"
                      alt="checkbox"
                      width={25}
                      height={25}
                    />
                  </span>
                </label>
              </div>
              <label
                htmlFor="remember"
                className="text-left font-medium text-[#8C99ACB8] text-sm cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-primary text-right text-sm cursor-pointer font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <div>
          <Button
            variant="primary"
            title="Login"
            type="submit"
            isLoading={isLoading}
            className="w-full"
          />
        </div>
      </form>
      <h2 className="text-primary text-center text-sm cursor-pointer mt-8 font-normal">
        Terms and Conditions.
      </h2>
    </div>
  );
};

export default Page;
