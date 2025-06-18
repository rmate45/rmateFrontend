"use client";

import Input from "@/components/form/Input/Input";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import Button from "@/components/shared/Button/Button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import {
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
} from "@/apis/admin/adminApi";
import clsx from "clsx";
import ProfileImageUpload from "@/components/form/ProfileImageUpload/ProfileImageUpload";
import { editAdminSchema } from "@/validation/editAdminschema";

const AdminEditPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading: loadingAdmin } = useGetAdminByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [updateAdmin, { isLoading: updating }] = useUpdateAdminMutation();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editAdminSchema(t)),
  });

  useEffect(() => {
    if (data?.data) {
      const a = data.data;
      reset({
        firstName: a.first_name,
        lastName: a.last_name,
        email: a.email,
        phone: a.phone_number,
        jobTitle: a.job_title,
        external: Boolean(a.external),
      });
      if (a.profile_picture) {
        setImagePreview(a.profile_picture.url);
      }
    }
  }, [data, reset]);

  const onSubmit = async (formValues) => {
    const formData = new FormData();
    formData.append("first_name", formValues.firstName);
    formData.append("last_name", formValues.lastName);
    formData.append("email", formValues.email);
    formData.append("phone_number", formValues.phone);
    formData.append("job_title", formValues.jobTitle);
    formData.append("external", formValues.external ? "1" : "0");
    if (imageFile) formData.append("profile_picture", imageFile);

    try {
      const res = await updateAdmin({ id, data: formData }).unwrap();
      if (res?.success) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loadingAdmin) return <div>Loading admin details...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "w-full bg-white p-10 rounded-md flex flex-col poppins text-formlable"
      )}
    >
      <h1 className="font-medium text-[32px] text-dark mb-8">
        {t("admin_form.edit_title")}
      </h1>

      {/* Image Upload Preview */}
      <ProfileImageUpload
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setImageFile={setImageFile}
      />

      {/* Name */}
      <div className="mb-4">
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

      {/* Contact Info */}
      <div className="mb-4">
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

      {/* Job Title */}
      <div className="mb-4">
        <h2 className="mb-3">{t("admin_form.job_title_label")}</h2>
        <Input
          placeholder={t("admin_form.job_title_placeholder")}
          type="text"
          {...register("jobTitle")}
          error={errors.jobTitle}
        />
      </div>

      {/* External */}
      <div className="mb-4">
        <Controller
          name="external"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label={t("admin_form.external_label")}
              name="external"
              options={[
                { label: t("admin_form.yes"), value: true },
                { label: t("admin_form.no"), value: false },
              ]}
              value={field.value}
              onChange={field.onChange}
              error={errors.external}
            />
          )}
        />
      </div>

      {/* Submit */}
      <div className="max-w-[350px] w-full mx-auto mt-12">
        <Button
          title={t("admin_form.update_button")}
          type="submit"
          isLoading={updating}
        />
      </div>
    </form>
  );
};

export default AdminEditPage;
