"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/shared/Button/Button";
import UnderlineInput from "@/components/form/UnderlineInput/UnderlineInput";

const schema = yup.object().shape({
  confirmation: yup
    .string()
    .required("Confirmation is required")
    .oneOf(["RELEASE"], 'You must type "RELEASE" to confirm'),
});

const ReleaseTenantModal = ({ onConfirm, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    onConfirm?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-center bg-white flex flex-col gap-6 items-center justify-center px-6 py-4"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="font-medium text-[26px] text-primary text-center">
          Are you sure <br /> you want to release the tenant?
        </h1>
        <p className="text-subheadline text-[14px]">
          Type “RELEASE” to confirm your action.
        </p>
      </div>

      <div className="w-full max-w-xs">
        <UnderlineInput
          type="text"
          placeholder="Type Here."
          {...register("confirmation")}
          error={errors.confirmation}
        />
      </div>

      <div className="flex justify-between gap-3 items-center w-full">
        <Button title="Yes" type="submit" />
        <Button title="No" variant="secondary" onClick={onCancel} />
      </div>
    </form>
  );
};

export default ReleaseTenantModal;
