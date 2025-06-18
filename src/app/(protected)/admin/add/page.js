"use client";

import Input from "@/components/form/Input/Input";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import Button from "@/components/shared/Button/Button";
import CustomCheckbox from "@/components/shared/CustomCheckbox/CustomCheckbox";
import SignatureField from "@/components/form/SignatureField/SignatureField";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { showToast } from "@/helpers/utils";
import { useRouter } from "next/navigation";
import { useCreateAdminMutation } from "@/apis/admin/adminApi";
import ProfileImageUpload from "@/components/form/ProfileImageUpload/ProfileImageUpload";
import { createAdminschema } from "@/validation/createAdminschema";

const Page = () => {
  const { t } = useTranslation();
  const sigRef = useRef();
  const [signatureError, setSignatureError] = useState(null);
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(createAdminschema(t)),
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
      setSignatureError(t("admin_form.validation.signature_required"));
      return;
    }

    if (!imageFile) {
      showToast(t("admin_form.validation.image_required"), "error");
      return;
    }

    const base64 = sigRef.current.getCanvas().toDataURL("image/png");
    const res = await fetch(base64);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone);
    formData.append("job_title", data.jobTitle);
    formData.append("external", data.external ? 1 : 0);
    formData.append("terms_and_conditions", data.agreed ? 1 : 0);
    formData.append("signature_data", base64); // or blob if needed
    formData.append("profile_picture", imageFile);

    try {
      const result = await createAdmin(formData).unwrap();
      if (result?.success) {
        router.push("/admin");
      }
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
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
          {t("admin_form.title")}
        </h1>
        <h2 className="mb-6 text-black font-medium text-base">
          {t("admin_form.admin_details")}
        </h2>

        {/* Image Upload Preview */}
        <ProfileImageUpload
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImageFile={setImageFile}
        />

        <div>
          <h2 className="mb-3">{t("admin_form.admin_name")}</h2>
          <div className="flex gap-6">
            <Input
              placeholder={t("admin_form.first_name_placeholder")}
              type="text"
              {...register("firstName")}
              error={errors.firstName}
            />
            <Input
              placeholder={t("admin_form.last_name_placeholder")}
              type="text"
              {...register("lastName")}
              error={errors.lastName}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-6">
            <div className="w-full">
              <h2 className="mb-3">{t("admin_form.email_label")}</h2>
              <Input
                placeholder={t("admin_form.email_placeholder")}
                type="email"
                {...register("email")}
                error={errors.email}
              />
            </div>
            <div className="w-full">
              <h2 className="mb-3">{t("admin_form.phone_label")}</h2>
              <Input
                placeholder={t("admin_form.phone_placeholder")}
                type="text"
                {...register("phone")}
                error={errors.phone}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full max-w-1/2 pr-3">
            <h2 className="mb-3">{t("admin_form.job_title_label")}</h2>
            <Input
              placeholder={t("admin_form.job_title_placeholder")}
              type="text"
              {...register("jobTitle")}
              error={errors.jobTitle}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full max-w-1/2 pr-3">
            <Controller
              name="external"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label={t("admin_form.external_label")}
                  name="external"
                  options={[
                    { label: t("admin_form.yes"), value: 1 },
                    { label: t("admin_form.no"), value: 0 },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.external}
                />
              )}
            />
          </div>
        </div>

        {/* Terms and Agreement Section */}
        <section className="space-y-4 mt-2">
          <h2 className="text-lg font-medium text-dark border-b border-subheadline pb-2">
            Terms and Agreement
          </h2>

          <div className="leading-relaxed my-4">
            <p className="mb-4 font-medium">
              {t("admin_form.agreement_intro")}
            </p>
            <ol className="list-inside">
              <li className="mb-2">{t("admin_form.agreement_point1")}</li>
              <li>{t("admin_form.agreement_point2")}</li>
            </ol>
          </div>

          <div className="mt-4">
            <Controller
              name="agreed"
              control={control}
              render={({ field }) => (
                <CustomCheckbox
                  id="agreed"
                  label={
                    <span className="text-base">
                      {t("admin_form.agreement_checkbox")}
                      <span className="text-primary cursor-pointer">
                        {" "}
                        {t("admin_form.terms")}
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
          label={t("admin_form.signature_label")}
          sigRef={sigRef}
          signatureError={signatureError}
          onClear={clear}
        />

        <div className="max-w-[350px] w-full mx-auto mt-12">
          <Button
            title={t("admin_form.submit_button")}
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </form>
    </>
  );
};

export default Page;
