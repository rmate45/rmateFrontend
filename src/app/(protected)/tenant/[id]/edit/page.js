"use client";

import Input from "@/components/form/Input/Input";
import Button from "@/components/shared/Button/Button";
import clsx from "clsx";
import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FileDropzone from "@/components/form/FileDropzone/FileDropzone";
import { useTranslation } from "react-i18next";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import TextArea from "@/components/form/TextArea/TextArea";
import { formatDateToYMD, objectToFormData, showToast } from "@/helpers/utils";
import FormLable from "@/components/form/FormLable/FormLable";
import DateInput from "@/components/form/DateInput/DateInput";
import FilePreview from "@/components/form/FilePreview/FilePreview";
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
} from "@/apis/tenant/tenantApi";
import { useParams, useRouter } from "next/navigation";
import ProfileImageUpload from "@/components/form/ProfileImageUpload/ProfileImageUpload";
import { tenantEditValidationSchema } from "@/validation/tenantEditApplicationSchema";

const TenantApplicationForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const sigRef = useRef();
  const router = useRouter();

  const { data, isLoading, isError } = useGetTenantByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [updateTenant, { isLoading: updating }] = useUpdateTenantMutation();

  // State management
  const [idProofFile, setIdProofFile] = useState(null);
  const [paystubFiles, setPaystubFiles] = useState([]); // Combined array for all paystubs (existing + new)
  const [idProofError, setIdProofError] = useState(null);
  const [paystubError, setPaystubError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingIdFileName, setExistingIdFileName] = useState(null);
  const [existingIdFileUrl, setExistingIdFileUrl] = useState(null);

  // Memoized validation schema
  const schema = useMemo(() => tenantEditValidationSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const hasAnsweredYesToAnyQuestion = watch([
    "evicted",
    "convicted_felony",
    "declared_bankruptcy",
  ]).some((answer) => answer === true);

  // Load existing tenant data for editing
  useEffect(() => {
    if (data?.data) {
      const tenant = data.data;

      reset({
        first_name: tenant.first_name,
        last_name: tenant.last_name,
        email: tenant.email,
        phone_number: tenant.phone_number,
        address_line_1: tenant.address_line_1,
        address_line_2: tenant.address_line_2,
        city: tenant.city,
        state: tenant.state,
        postal_code: tenant.postal_code,
        is_currently_employed: tenant.is_currently_employed == 1 ? true : false,
        current_employer: tenant.current_employer,
        employment_duration: tenant.employment_duration,
        total_monthly_salary: tenant.total_monthly_salary,
        preferred_move_in_date: tenant.preferred_move_in_date
          ? tenant.preferred_move_in_date.split("T")[0]
          : "",
        has_pets: tenant.has_pets == 1 ? true : false,
        evicted: tenant.evicted == 1 ? true : false,
        convicted_felony: tenant.convicted_felony == 1 ? true : false,
        declared_bankruptcy: tenant.declared_bankruptcy == 1 ? true : false,
        legal_history_explanation: tenant.legal_history_explanation,
        landlord_first_name: tenant.landlord_first_name,
        landlord_last_name: tenant.landlord_last_name,
        landlord_phone_number: tenant.landlord_phone_number,
      });

      // Handle existing ID document
      if (tenant.id_document?.url) {
        const fileUrl = tenant.id_document.url;
        const fileName = fileUrl.split("/").pop();
        setExistingIdFileName(fileName);
        setExistingIdFileUrl(fileUrl);
      }

      // Handle existing profile picture
      if (tenant.profile_picture) {
        setImagePreview(tenant.profile_picture.url);
      }

      // Handle existing paystubs - convert to unified format
      if (tenant.paystubs && Array.isArray(tenant.paystubs)) {
        const formattedPaystubs = tenant.paystubs.map((paystub) => ({
          id: paystub.id,
          name: paystub.url.split("/").pop() || `Paystub ${paystub.id}`,
          url: paystub.url,
          isExisting: true,
        }));
        setPaystubFiles(formattedPaystubs);
      }
    }
  }, [data, reset]);

  const handleIdProofUpload = useCallback((acceptedFiles) => {
    setIdProofFile(acceptedFiles[0]);
    setIdProofError(null);
    // Clear existing file when new one is uploaded
    setExistingIdFileName(null);
    setExistingIdFileUrl(null);
  }, []);

  const handlePaystubUpload = useCallback(
    (acceptedFiles) => {
      const totalFiles = paystubFiles.length;

      if (totalFiles + acceptedFiles.length > 3) {
        setPaystubError("You can upload a maximum of 3 paystubs");
        return;
      }

      // Add new files to the existing array
      const newPaystubFiles = acceptedFiles.map((file) => ({
        file,
        isExisting: false,
        name: file.name,
      }));

      setPaystubFiles((prev) => [...prev, ...newPaystubFiles]);
      setPaystubError(null);
    },
    [paystubFiles]
  );

  const handleRemovePaystub = (indexToRemove) => {
    setPaystubFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateFiles = useCallback(() => {
    let hasErrors = false;

    // Check ID proof (either new file or existing file should be present)
    if (!idProofFile && !existingIdFileUrl) {
      setIdProofError(t("owner_application_form.error_id_proof_required"));
      showToast(t("owner_application_form.error_id_proof_required"), "error");
      hasErrors = true;
    } else {
      setIdProofError(null);
    }

    // Check paystubs
    if (paystubFiles.length === 0) {
      showToast("Please upload your recent paystubs", "error");
      setPaystubError("Please upload your recent paystubs");
      hasErrors = true;
    } else {
      setPaystubError(null);
    }

    return !hasErrors;
  }, [idProofFile, existingIdFileUrl, paystubFiles, t]);

  const onSubmit = useCallback(
    async (data) => {
      const areFilesValid = validateFiles();

      if (!areFilesValid) return;

      // Check profile image (either new file or existing preview should be present)
      if (!imageFile && !imagePreview) {
        showToast("Please attach profile image.", "error");
        return;
      }

      try {
        const signatureDataUrl = sigRef.current
          ?.getCanvas()
          .toDataURL("image/png");

        const submissionData = {
          ...data,
          signature_data: signatureDataUrl,
          is_currently_employed: data.is_currently_employed == true ? 1 : 0,
          has_pets: data.has_pets == true ? 1 : 0,
          evicted: data.evicted == true ? 1 : 0,
          convicted_felony: data.convicted_felony == true ? 1 : 0,
          declared_bankruptcy: data.declared_bankruptcy == true ? 1 : 0,
          preferred_move_in_date: data.preferred_move_in_date
            ? formatDateToYMD(data.preferred_move_in_date)
            : null,
        };

        const formData = new FormData();

        // Append form fields
        Object.keys(submissionData).forEach((key) => {
          if (
            submissionData[key] !== null &&
            submissionData[key] !== undefined
          ) {
            formData.append(key, submissionData[key]);
          }
        });

        // Append files
        if (imageFile) formData.append("profile_picture", imageFile);
        if (idProofFile) formData.append("id_document", idProofFile);

        // Append paystubs as indexed fields (paystubs[0], paystubs[1], paystubs[2])
        paystubFiles.forEach((paystub, index) => {
          if (paystub.isExisting) {
            // For existing paystubs, send the ID or URL
            // formData.append(`paystubs[${index}]`, paystub.id || paystub.url);
          } else {
            // For new paystubs, send the file
            formData.append(`paystubs[${index}]`, paystub.file);
          }
        });

        let response = await updateTenant({ id, data: formData }).unwrap();

        if (response?.success) {
          router.push("/tenant");
        }
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
    [
      validateFiles,
      imageFile,
      imagePreview,
      idProofFile,
      paystubFiles,
      updateTenant,
      router,
      id,
    ]
  );

  // Radio button options
  const yesNoOptions = useMemo(
    () => [
      { label: t("admin_form.yes"), value: true },
      { label: t("admin_form.no"), value: false },
    ],
    [t]
  );

  useEffect(() => {
    if (!watch("is_currently_employed")) {
      setValue("current_employer", "");
      setValue("employment_duration", "");
      setValue("total_monthly_salary", null);
    }
  }, [watch("is_currently_employed"), setValue]);

  if (isLoading) return <div>Loading tenant data...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "w-full bg-white p-6 md:p-10 rounded-md flex flex-col poppins text-formlable",
        " mx-auto space-y-6"
      )}
      noValidate
    >
      <h1 className="font-medium text-2xl md:text-[32px] text-dark mb-8">
        Edit Tenant Application
      </h1>

      <h2 className="text-lg font-medium text-dark border-subheadline">
        Tenant Details
      </h2>

      {/* Image Upload Preview */}
      <ProfileImageUpload
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setImageFile={setImageFile}
      />

      {/* Personal Information Section */}
      <section className="space-y-4">
        {/* Name Fields */}
        <div>
          <FormLable>Applicant Name</FormLable>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              type="text"
              {...register("first_name")}
              error={errors.first_name}
              aria-describedby="first_name-error"
            />
            <Input
              placeholder="Last Name"
              type="text"
              {...register("last_name")}
              error={errors.last_name}
              aria-describedby="last_name-error"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLable>Email Address</FormLable>
            <Input
              placeholder="example@example.com"
              type="email"
              {...register("email")}
              error={errors.email}
              aria-describedby="email-error"
            />
          </div>
          <div>
            <FormLable>Phone Number</FormLable>
            <Input
              placeholder="(000) 000-0000"
              type="tel"
              {...register("phone_number")}
              error={errors.phone_number}
              aria-describedby="phone_number-error"
            />
          </div>
        </div>

        {/* ID Proof Upload */}
        <div>
          <FormLable>ID Proof</FormLable>
          <p className="text-sm text-gray-600 mb-2">
            Please upload a valid government-issued ID (Driver's License,
            Passport, etc.)
          </p>
          <FileDropzone
            file={idProofFile}
            onDrop={handleIdProofUpload}
            error={idProofError}
            accept="image/*,.pdf"
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </div>

        {/* Show new ID proof file preview */}
        {idProofFile && (
          <FilePreview
            file={idProofFile}
            onRemove={() => setIdProofFile(null)}
          />
        )}

        {/* Show existing ID proof file preview */}
        {!idProofFile && existingIdFileUrl && (
          <FilePreview
            file={{
              name: existingIdFileName,
              url: existingIdFileUrl,
            }}
            onRemove={() => {
              setExistingIdFileName(null);
              setExistingIdFileUrl(null);
            }}
          />
        )}
      </section>

      {/* Employment Information Section */}
      <section className="space-y-4">
        <div>
          <Controller
            name="is_currently_employed"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Are you currently employed?"
                name="is_currently_employed"
                options={yesNoOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.is_currently_employed}
              />
            )}
          />
        </div>

        {watch("is_currently_employed") === true && (
          <>
            <div className="w-full max-w-1/2 pr-3">
              <FormLable>Current Employer</FormLable>
              <Input
                placeholder="Company Name"
                type="text"
                {...register("current_employer")}
                error={errors.current_employer}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLable>Length of Employment</FormLable>
                <Input
                  placeholder="e.g., 2 years 6 months"
                  type="text"
                  {...register("employment_duration")}
                  error={errors.employment_duration}
                />
              </div>
              <div>
                <FormLable>Combined Monthly Salary (USD)</FormLable>
                <Input
                  placeholder="5000"
                  type="number"
                  min="0"
                  step="100"
                  {...register("total_monthly_salary")}
                  error={errors.total_monthly_salary}
                />
              </div>
            </div>
          </>
        )}
      </section>

      {/* Move-in Information Section */}
      <section className="space-y-4">
        <div className="w-full max-w-1/2 pr-3">
          <FormLable>Preferred Move-in Date</FormLable>
          <div className="">
            <DateInput
              placeholder="Select a date"
              {...register("preferred_move_in_date")}
              error={errors.preferred_move_in_date}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div>
          <Controller
            name="has_pets"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Do you have pets?"
                name="has_pets"
                options={yesNoOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.has_pets}
              />
            )}
          />
        </div>

        {/* Paystub Upload */}
        <div>
          <FormLable>Recent Paystubs</FormLable>
          <p className="text-sm text-gray-600 mb-2">
            Please attach your most recent paystubs here (max 3):
          </p>
          <FileDropzone
            file={paystubFiles}
            onDrop={handlePaystubUpload}
            error={paystubError}
            accept={{ "application/pdf": [], "image/*": [] }}
            maxSize={10 * 1024 * 1024}
            multiple={true}
            maxFiles={3 - paystubFiles.length}
          />

          {/* Show all paystubs (existing and new) */}
          {paystubFiles.map((paystub, index) => (
            <FilePreview
              key={
                paystub.isExisting ? `existing-${paystub.id}` : `new-${index}`
              }
              file={paystub.isExisting ? paystub : paystub.file}
              onRemove={() => handleRemovePaystub(index)}
              isExisting={paystub.isExisting}
            />
          ))}
        </div>
      </section>

      {/* Current Housing Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-dark border-subheadline py-2">
          Tenant History
        </h2>

        <div className="space-y-4">
          <div>
            <FormLable>Street Address Line 1</FormLable>
            <Input
              placeholder="Street Address"
              type="text"
              {...register("address_line_1")}
              error={errors.address_line_1}
            />
          </div>

          <div>
            <FormLable>Street Address Line 2</FormLable>
            <Input
              placeholder="Apartment, Suite, etc. (Optional)"
              type="text"
              {...register("address_line_2")}
              error={errors.address_line_2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLable>City</FormLable>
              <Input
                placeholder="City"
                type="text"
                {...register("city")}
                error={errors.city}
              />
            </div>

            <div>
              <FormLable>State/Province</FormLable>
              <Input
                placeholder="State"
                type="text"
                {...register("state")}
                error={errors.state}
              />
            </div>
          </div>

          <div>
            <FormLable>Postal/ZIP Code</FormLable>
            <Input
              placeholder="ZIP Code"
              type="text"
              {...register("postal_code")}
              error={errors.postal_code}
            />
          </div>

          <div>
            <FormLable>Current Landlord</FormLable>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  placeholder="Landlord First Name"
                  type="text"
                  {...register("landlord_first_name")}
                  error={errors.landlord_first_name}
                />
              </div>

              <Input
                placeholder="Landlord Last Name"
                type="text"
                {...register("landlord_last_name")}
                error={errors.landlord_last_name}
              />
            </div>
            <div className="w-full max-w-1/2 pr-3">
              <FormLable>Phone Number of current Landlord</FormLable>
              <Input
                placeholder="Landlord Phone Number"
                type="tel"
                {...register("landlord_phone_number")}
                error={errors.landlord_phone_number}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Background Check Section */}
      <section className="space-y-4">
        <div className="space-y-4">
          <Controller
            name="evicted"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Have you ever been evicted?"
                name="evicted"
                options={yesNoOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.evicted}
              />
            )}
          />

          <Controller
            name="convicted_felony"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Have you ever been convicted of a felony?"
                name="convicted_felony"
                options={yesNoOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.convicted_felony}
              />
            )}
          />

          <Controller
            name="declared_bankruptcy"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Have you ever declared bankruptcy?"
                name="declared_bankruptcy"
                options={yesNoOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.declared_bankruptcy}
              />
            )}
          />

          {hasAnsweredYesToAnyQuestion && (
            <div>
              <FormLable> Please explain your answer(s) above:</FormLable>
              <TextArea
                placeholder="Please provide additional details..."
                {...register("legal_history_explanation")}
                error={errors.legal_history_explanation}
                rows={4}
              />
            </div>
          )}
        </div>
      </section>

      {/* Submit Button */}
      <div className="max-w-[350px] w-full mx-auto mt-12">
        <Button
          title="Update Application"
          type="submit"
          isLoading={updating}
          disabled={updating}
        />
      </div>
    </form>
  );
};

export default TenantApplicationForm;
