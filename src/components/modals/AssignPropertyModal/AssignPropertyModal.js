"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/shared/Button/Button";
import LabeledInputRow from "@/components/form/LabeledInputRow/LabeledInputRow";

const AssignPropertyModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Assign Property Data:", data);
    // Add API call here if needed
    onClose?.(); // Close modal if callback exists
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white flex flex-col gap-6 px-6 py-4 text-subheadline"
    >
      <h1 className="font-medium text-[26px] text-primary text-center">
        Assign new Property to
      </h1>

      <div className="space-y-2">
        <h2>Tenant Details</h2>
        <LabeledInputRow
          label="Tenant ID :"
          placeholder="Enter tenant ID"
          {...register("tenantId", { required: "Tenant ID is required" })}
          error={errors.tenantId}
        />
        <LabeledInputRow
          label="Tenant Name :"
          placeholder="Enter tenant name"
          {...register("tenantName", { required: "Tenant name is required" })}
          error={errors.tenantName}
        />
      </div>

      <div className="space-y-2">
        <h2>Property Details</h2>
        <LabeledInputRow
          label="Property Name :"
          placeholder="Enter property name"
          {...register("propertyName", {
            required: "Property name is required",
          })}
          error={errors.propertyName}
        />
      </div>

      <div className="space-y-2">
        <h2>Payment</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <LabeledInputRow
            label="Security :"
            type="number"
            placeholder="Enter security amount"
            {...register("security", { required: "Security is required" })}
            error={errors.security}
          />
          <LabeledInputRow
            label="Rent/Mo :"
            type="number"
            placeholder="Enter monthly rent"
            {...register("rent", { required: "Rent is required" })}
            error={errors.rent}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2>Lease Date</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <LabeledInputRow
            label="Start :"
            type="date"
            {...register("leaseStart", {
              required: "Lease start date is required",
            })}
            error={errors.leaseStart}
          />
          <LabeledInputRow
            label="End :"
            type="date"
            {...register("leaseEnd", {
              required: "Lease end date is required",
            })}
            error={errors.leaseEnd}
          />
        </div>
      </div>

      <div className="flex justify-between gap-3 items-center w-full">
        <Button title="Assign Property" type="submit" />
        <Button title="Cancel" variant="secondary" onClick={onClose} />
      </div>
    </form>
  );
};

export default AssignPropertyModal;
