"use client";

import Input from "@/components/form/Input/Input";
import Button from "@/components/shared/Button/Button";
import CustomCheckbox from "@/components/shared/CustomCheckbox/CustomCheckbox";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SignatureField from "@/components/form/SignatureField/SignatureField";
import FileDropzone from "@/components/form/FileDropzone/FileDropzone";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { showToast } from "@/helpers/utils";
import { useCreateOwnerMutation } from "@/apis/owner/ownerApi";
import ProfileImageUpload from "@/components/form/ProfileImageUpload/ProfileImageUpload";
import { useRouter } from "next/navigation";
import FilePreview from "@/components/form/FilePreview/FilePreview";
import { createOwnerSchema } from "@/validation/createOwnerSchema";

const Page = () => {
  const { t } = useTranslation();
  const sigRef = useRef();
  const [signatureError, setSignatureError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [createOwner, { isLoading }] = useCreateOwnerMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(createOwnerSchema),
    defaultValues: {
      agreed: false,
    },
  });

  const clear = () => {
    sigRef.current.clear();
    setSignatureError(null);
  };

  const onSubmit = async (data) => {
    if (sigRef.current.isEmpty()) {
      setSignatureError(t("owner_application_form.error_signature_required"));
      return;
    } else {
      setSignatureError(null);
    }

    if (!uploadedFile) {
      setFileError(t("owner_application_form.error_id_proof_required"));
      return;
    } else {
      setFileError(null);
    }

    if (!imageFile) {
      showToast(t("admin_form.validation.image_required"), "error");
      return;
    }
    const signatureDataUrl = sigRef.current.toDataURL();

    // console.log(signatureDataUrl, "sigRef.current");

    const formData = new FormData();
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone);
    formData.append("address_line_1", data.streetAddress);
    formData.append("address_line_2", data.streetAddress2 || "");
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("postal_code", data.zip);
    formData.append("terms_and_conditions", data.agreed ? "1" : "0");
    formData.append("id_document", uploadedFile);
    formData.append("signature_data", signatureDataUrl);
    formData.append("profile_picture", imageFile);

    try {
      const response = await createOwner(formData).unwrap();
      console.log("Owner created successfully", response);
      if (response?.success) {
        router.push("/owner");
      }
      // Optionally reset form or show success
    } catch (error) {
      console.error("Error creating owner:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          "w-full bg-white p-10 rounded-md flex flex-col poppins text-formlable"
        )}
      >
        <h1 className="font-medium text-[32px] text-dark mb-8">
          {t("owner_application_form.title")}
        </h1>

        <h2 className="mb-6 text-black font-medium text-base">
          {t("owner_application_form.owner_details")}
        </h2>

        {/* Image Upload Preview */}
        <ProfileImageUpload
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImageFile={setImageFile}
        />

        <div>
          <h2 className="mb-3">{t("owner_application_form.owner_name")}</h2>
          <div className="flex gap-6">
            <Input
              placeholder={t("owner_application_form.first_name")}
              type="text"
              {...register("firstName")}
              error={errors.firstName}
            />
            <Input
              placeholder={t("owner_application_form.last_name")}
              type="text"
              {...register("lastName")}
              error={errors.lastName}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-6">
            <div className="w-full">
              <h2 className="mb-3">{t("owner_application_form.email")}</h2>
              <Input
                placeholder="example@example.com"
                type="email"
                {...register("email")}
                error={errors.email}
              />
            </div>
            <div className="w-full">
              <h2 className="mb-3">{t("owner_application_form.phone")}</h2>
              <Input
                placeholder="(000) 000-0000"
                type="text"
                {...register("phone")}
                error={errors.phone}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="mb-3">
            {t("owner_application_form.attach_id_proof")}
          </h2>
          <FileDropzone
            file={uploadedFile}
            onDrop={(acceptedFiles) => {
              setUploadedFile(acceptedFiles[0]);
              setFileError(null);
            }}
            accept="image/*,.pdf"
            error={fileError}
            maxSize={5 * 1024 * 1024}
          />

          {/* Show uploaded file with remove option */}
          {uploadedFile && (
            <FilePreview
              file={uploadedFile}
              onRemove={() => setUploadedFile(null)}
            />
          )}
        </div>

        <div className="my-4">
          <h2 className="mb-6 text-black font-medium text-base">
            {t("owner_application_form.current_address")}
          </h2>

          <div className="w-full space-y-4">
            <div className="w-full">
              <h2 className="mb-3">
                {t("owner_application_form.street_address")}
              </h2>
              <Input
                placeholder={t("owner_application_form.street_address")}
                type="text"
                {...register("streetAddress")}
                error={errors.streetAddress}
              />
            </div>
            <div className="w-full">
              <h2 className="mb-3">
                {t("owner_application_form.street_address_2")}
              </h2>
              <Input
                placeholder={t("owner_application_form.street_address_2")}
                type="text"
                {...register("streetAddress2")}
                error={errors.streetAddress2}
              />
            </div>

            <div className="flex gap-6">
              <div className="w-full">
                <h2 className="mb-3">{t("owner_application_form.city")}</h2>
                <Input
                  placeholder={t("owner_application_form.city")}
                  type="text"
                  {...register("city")}
                  error={errors.city}
                />
              </div>
              <div className="w-full">
                <h2 className="mb-3">{t("owner_application_form.state")}</h2>
                <Input
                  placeholder={t("owner_application_form.state")}
                  type="text"
                  {...register("state")}
                  error={errors.state}
                />
              </div>
            </div>

            <div className="w-full">
              <h2 className="mb-3">{t("owner_application_form.zip")}</h2>
              <Input
                placeholder={t("owner_application_form.zip")}
                type="text"
                {...register("zip")}
                error={errors.zip}
              />
            </div>
          </div>
        </div>

        <section className="space-y-4 mt-2">
          <h2 className="text-lg font-medium text-dark border-b border-subheadline pb-2">
            Terms and Agreement
          </h2>
          <div className="leading-relaxed my-4">
            <p className="mb-4 font-medium">
              {t("owner_application_form.agreement_intro")}
            </p>
            <ol className="list">
              <li className="mb-2">
                {t("owner_application_form.agreement_1")}
              </li>
              <li className="mb-2">
                {t("owner_application_form.agreement_2")}
              </li>
              <li>{t("owner_application_form.agreement_3")}</li>
            </ol>
          </div>

          <div className="mt-4">
            {/* <h2 className="mb-3">{t("owner_application_form.confirm")}</h2> */}
            <Controller
              name="agreed"
              control={control}
              render={({ field }) => (
                <CustomCheckbox
                  id="agreed"
                  label={
                    <span className="text-base">
                      {t("owner_application_form.checkbox_text")}
                      <span className="text-primary cursor-pointer">
                        {" "}
                        {t("owner_application_form.terms_and_conditions")}
                      </span>
                      .
                    </span>
                  }
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            {errors.agreed && (
              <p className="text-sm text-red-500 mt-1">
                {errors.agreed.message}
              </p>
            )}
          </div>
        </section>

        <SignatureField
          label={t("owner_application_form.signature")}
          sigRef={sigRef}
          signatureError={signatureError}
          onClear={clear}
        />

        <div className="max-w-[350px] w-full mx-auto mt-12">
          <Button
            title={t("owner_application_form.submit")}
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </form>
    </>
  );
};

export default Page;
