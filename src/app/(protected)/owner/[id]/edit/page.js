"use client";

import Input from "@/components/form/Input/Input";
import Button from "@/components/shared/Button/Button";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FileDropzone from "@/components/form/FileDropzone/FileDropzone";
import { useTranslation } from "react-i18next";
import { showToast } from "@/helpers/utils";
import {
  useUpdateOwnerMutation,
  useGetOwnerByIdQuery,
} from "@/apis/owner/ownerApi";
import ProfileImageUpload from "@/components/form/ProfileImageUpload/ProfileImageUpload";
import { useParams, useRouter } from "next/navigation";
import FilePreview from "@/components/form/FilePreview/FilePreview";
import { updateOwnerSchema } from "@/validation/updateOwnerSchema";


const Page = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();

  const isEdit = !!id;

  const { data, isLoading: loadingOwner } = useGetOwnerByIdQuery(id, {
    skip: !isEdit,
    refetchOnMountOrArgChange: true,
  });

  const [updateOwner, { isLoading: updating }] = useUpdateOwnerMutation();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingFileName, setExistingFileName] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(updateOwnerSchema),
    defaultValues: {
      agreed: false,
    },
  });

  // Load existing owner data for editing
  useEffect(() => {
    if (data?.data) {
      const o = data.data;
      reset({
        firstName: o.first_name,
        lastName: o.last_name,
        email: o.email,
        phone: o.phone_number,
        streetAddress: o.address_line_1,
        streetAddress2: o.address_line_2,
        city: o.city,
        state: o.state,
        zip: o.postal_code,
        agreed: true,
      });

      if (o.id_document) {
        setUploadedFile(null); // Optionally, you can show a download/view link here
      }

      if (o.id_document?.url) {
        const fileUrl = o.id_document.url;
        const fileName = fileUrl.split("/").pop();
        setExistingFileName(fileName);
        setExistingFileUrl(fileUrl);
      }

      if (o.profile_picture) {
        setImagePreview(o.profile_picture.url);
      }
    }
  }, [data, reset]);

  const onSubmit = async (formValues) => {
    // Ensure either a new file is uploaded or an existing one is still present
    if (!uploadedFile && !existingFileUrl) {
      setFileError(t("owner_application_form.error_id_proof_required"));
      return;
    }

    // Ensure profile image is present
    if (!imageFile && !imagePreview) {
      showToast(t("admin_form.validation.image_required"), "error");
      return;
    }

    setFileError(null); // clear previous errors

    const formData = new FormData();
    formData.append("first_name", formValues.firstName);
    formData.append("last_name", formValues.lastName);
    formData.append("email", formValues.email);
    formData.append("phone_number", formValues.phone);
    formData.append("address_line_1", formValues.streetAddress);
    formData.append("address_line_2", formValues.streetAddress2 || "");
    formData.append("city", formValues.city);
    formData.append("state", formValues.state);
    formData.append("postal_code", formValues.zip);

    if (uploadedFile) formData.append("id_document", uploadedFile);
    if (imageFile) formData.append("profile_picture", imageFile);

    try {
      const res = await updateOwner({ id, data: formData }).unwrap();
      if (res?.success) {
        router.push("/owner");
      }
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (loadingOwner) return <div>Loading owner data...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "w-full bg-white p-10 rounded-md flex flex-col poppins text-formlable"
      )}
    >
      <h1 className="font-medium text-[32px] text-dark mb-8">
        {isEdit
          ? t("owner_application_form.edit_title")
          : t("owner_application_form.title")}
      </h1>

      <h2 className="mb-6 text-black font-medium text-base">
        {t("owner_application_form.owner_details")}
      </h2>

      <ProfileImageUpload
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setImageFile={setImageFile}
      />

      {/* Name fields */}
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

      {/* Email & Phone */}
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

      {/* ID Proof */}
      <div className="mt-4">
        <h2 className="mb-3">{t("owner_application_form.attach_id_proof")}</h2>
        <FileDropzone
          file={uploadedFile}
          onDrop={(acceptedFiles) => {
            setUploadedFile(acceptedFiles[0]);
            setFileError(null);
          }}
          accept="image/*,.pdf"
          error={fileError}
        />

        {uploadedFile && (
          <FilePreview
            file={uploadedFile}
            onRemove={() => setUploadedFile(null)}
          />
        )}

        {!uploadedFile && existingFileUrl && (
          <FilePreview
            file={{
              name: existingFileName,
              url: existingFileUrl,
            }}
            onRemove={() => {
              setExistingFileName(null);
              setExistingFileUrl(null);
            }}
          />
        )}
      </div>

      {/* Address */}
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

      <div className="max-w-[350px] w-full mx-auto mt-12">
        <Button
          title={
            isEdit
              ? t("owner_application_form.update_button")
              : t("owner_application_form.submit")
          }
          type="submit"
          isLoading={updating}
        />
      </div>
    </form>
  );
};

export default Page;
