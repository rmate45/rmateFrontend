"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import FormLable from "@/components/form/FormLable/FormLable";
import Input from "@/components/form/Input/Input";
import Button from "@/components/shared/Button/Button";

// Yup Validation Schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Insurance name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Insurance price is required"),
});

export const InsuranceServicesModal = ({
  initialInsurance = [],
  onSaveInsurance,
  onClose,
}) => {
  const [insurances, setInsurances] = useState(initialInsurance);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", price: "" },
    resolver: yupResolver(validationSchema),
  });

  const onAddInsurance = (data) => {
    setInsurances([...insurances, data]);
    reset(); // clear form after add
  };

  const handleDelete = (index) => {
    setInsurances(insurances.filter((_, i) => i !== index));
  };

  const handleFinalSave = () => {
    if (typeof onSaveInsurance === "function") {
      onSaveInsurance(insurances);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg w-full">
      <h2 className="text-lg font-medium text-dark mb-4">
        {t("insurance.title")}
      </h2>

      <form onSubmit={handleSubmit(onAddInsurance)}>
        <div className="border-2 border-dashed border-[#C4C4C4] p-4 rounded-md mb-4 flex flex-col gap-4">
          <div className="flex gap-4">
            {/* Insurance Name */}
            <div className="w-full">
              <FormLable>{t("insurance.fields.insuranceName.label")}</FormLable>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder={t(
                      "insurance.fields.insuranceName.placeholder"
                    )}
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Insurance Price */}
            <div className="w-full max-w-[200px]">
              <FormLable>
                {t("insurance.fields.insurancePrice.label")}
              </FormLable>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder={t(
                      "insurance.fields.insurancePrice.placeholder"
                    )}
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                  />
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <Button
            title={t("common.add")}
            iconSrc="/plus-white.svg"
            className="max-w-fit ml-auto"
            type="submit"
          />
        </div>
      </form>

      {/* Added Insurances List */}
      {insurances.length > 0 ? (
        <h3 className="text-md font-medium text-dark mb-2">
          {t("insurance.addedServicesTitle")}
        </h3>
      ) : (
        ""
      )}

      <div className="flex flex-col gap-2 mb-6">
        {insurances.map((insurance, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 rounded px-4 py-2"
          >
            <span className="text-sm text-gray-800">
              {insurance.name} - ${insurance.price}
            </span>
            <button
              onClick={() => handleDelete(index)}
              className="ml-auto p-1"
              aria-label={t("common.delete")}
            >
              <Image
                src="/delete.svg"
                alt={t("common.delete")}
                width={18}
                height={18}
                className="w-4 h-4"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button
          title={t("common.cancel")}
          variant="secondary"
          onClick={onClose}
        />
        <Button
          title={t("common.save")}
          className="min-w-[90px]"
          onClick={handleFinalSave}
        />
      </div>
    </div>
  );
};
