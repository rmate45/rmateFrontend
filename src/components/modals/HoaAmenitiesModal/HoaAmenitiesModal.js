"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";

import FormLable from "@/components/form/FormLable/FormLable";
import Input from "@/components/form/Input/Input";
import Button from "@/components/shared/Button/Button";
import Dropdown from "@/components/form/Dropdown/Dropdown";
import { useGetPropertyAmenitiesQuery } from "@/store/globalApi";

const validationSchema = yup.object().shape({
  name: yup.string().required("Amenity is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
});

export const HoaAmenitiesModal = ({
  initialAmenities = [],
  onSaveAmenities,
  onClose,
}) => {
  const { t } = useTranslation();
  const { data: amenitiesData, isLoading } = useGetPropertyAmenitiesQuery();

  const [addedAmenities, setAddedAmenities] = useState(initialAmenities);
  const [customAmenity, setCustomAmenity] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", price: "" },
    resolver: yupResolver(validationSchema),
  });

  const selectedAmenity = watch("name");

  const amenityList = Array.isArray(amenitiesData?.data)
    ? amenitiesData.data
    : Array.isArray(amenitiesData)
    ? amenitiesData
    : [];

  const amenityOptions = amenityList.map((item) => ({
    label: item,
    value: item,
  }));

  amenityOptions.push({ label: "Other", value: "other" });

  const onAddAmenity = ({ name, price }) => {
    const finalName = name === "other" ? customAmenity : name;
    if (!finalName) return;

    setAddedAmenities([...addedAmenities, { name: finalName, price }]);
    setCustomAmenity("");
    reset();
  };

  const onDeleteAmenity = (index) => {
    setAddedAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinalSave = () => {
    if (typeof onSaveAmenities === "function") {
      onSaveAmenities(addedAmenities);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg space-y-6">
      <h2 className="text-lg font-medium text-dark border-subheadline">
        {t("hoaAmenities.title")}
      </h2>

      <form onSubmit={handleSubmit(onAddAmenity)}>
        <div className="p-4 flex gap-4 border-[#7D7D7D] border-2 border-dashed rounded-md">
          {/* Amenity Dropdown */}
          <div className="w-full">
            <FormLable>{t("hoaAmenities.fields.serviceName.label")}</FormLable>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={amenityOptions}
                  placeholder={t("hoaAmenities.fields.serviceName.placeholder")}
                />
              )}
            />
            {selectedAmenity === "other" && (
              <Input
                placeholder="Enter custom amenity"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                className="mt-2"
              />
            )}
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Price Input */}
          <div className="w-full max-w-[200px]">
            <FormLable>{t("hoaAmenities.fields.servicePrice.label")}</FormLable>
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Input
                  placeholder={t(
                    "hoaAmenities.fields.servicePrice.placeholder"
                  )}
                  type="number"
                  min="0"
                  step="1"
                  {...field}
                />
              )}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title={t("common.add")}
            iconSrc="/plus-white.svg"
            className="mt-4"
            type="submit"
          />
        </div>
      </form>

      {/* Amenity List */}
      {addedAmenities.length > 0 && (
        <>
          <h2 className="text-lg font-medium text-dark border-subheadline">
            {t("hoaAmenities.addedAmenitiesTitle")}
          </h2>

          <div className="flex flex-col gap-4">
            {addedAmenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center rounded-md bg-[#D2D4D633] p-4"
              >
                <span>
                  {amenity.name} - ${amenity.price}
                </span>
                <Image
                  src="/delete.svg"
                  alt={t("common.delete")}
                  width={18}
                  height={18}
                  className="w-5 h-5 cursor-pointer ml-auto"
                  onClick={() => onDeleteAmenity(index)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <Button title={t("common.cancel")} variant="secondary" onClick={onClose} />
        <Button
          title={t("common.save")}
          className="min-w-[90px]"
          onClick={handleFinalSave}
        />
      </div>
    </div>
  );
};
