"use client";

import Input from "@/components/form/Input/Input";
import Button from "@/components/shared/Button/Button";
import CustomCheckbox from "@/components/shared/CustomCheckbox/CustomCheckbox";
import clsx from "clsx";
import React, { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SignatureField from "@/components/form/SignatureField/SignatureField";
import FileDropzone from "@/components/form/FileDropzone/FileDropzone";
import { useTranslation } from "react-i18next";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import TextArea from "@/components/form/TextArea/TextArea";
import {
  objectToFormData,
  showToast,
} from "@/helpers/utils";
import FormLable from "@/components/form/FormLable/FormLable";
import DateInput from "@/components/form/DateInput/DateInput";
import Image from "next/image";
import FilePreview from "@/components/form/FilePreview/FilePreview";
import { useCreateTenantMutation } from "@/apis/tenant/tenantApi";
import { useRouter } from "next/navigation";
import { tenantCreateValidationSchema } from "@/validation/tenantCreateApplicationSchema";

const TenantApplicationForm = () => {
  const { t } = useTranslation();
  const sigRef = useRef();
  const router = useRouter();

  // State management
  const [signatureError, setSignatureError] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [paystubFiles, setPaystubFiles] = useState([]);
  const [idProofError, setIdProofError] = useState(null);
  const [paystubError, setPaystubError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [createTenant, { isLoading }] = useCreateTenantMutation();

  // Memoized validation schema
  const schema = useMemo(() => tenantCreateValidationSchema(t), [t]);

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
    defaultValues: {
      terms_and_conditions: false,
      address_line_2: "",
      legal_history_explanation: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const hasAnsweredYesToAnyQuestion = watch([
    "evicted",
    "convicted_felony",
    "declared_bankruptcy",
  ]).some((answer) => answer === true);

  // Handlers
  const clearSignature = useCallback(() => {
    sigRef.current?.clear();
    setSignatureError(null);
  }, []);

  const handleIdProofUpload = useCallback((acceptedFiles) => {
    setIdProofFile(acceptedFiles[0]);
    setIdProofError(null);
  }, []);

  const handlePaystubUpload = useCallback(
    (acceptedFiles) => {
      const newFiles = [...paystubFiles, ...acceptedFiles];

      if (newFiles.length > 3) {
        setPaystubError("You can upload a maximum of 3 paystubs");
        return;
      }

      setPaystubFiles(newFiles);
      setPaystubError(null);
    },
    [paystubFiles]
  );

  const handleRemoveFile = (indexToRemove) => {
    setPaystubFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateFiles = useCallback(() => {
    let hasErrors = false;

    if (!idProofFile) {
      setIdProofError(t("owner_application_form.error_id_proof_required"));
      hasErrors = true;
    }

    if (!paystubFiles || paystubFiles.length === 0) {
      setPaystubError("Please upload your recent paystubs");
      hasErrors = true;
    }

    return !hasErrors;
  }, [idProofFile, paystubFiles, t]);

  const validateSignature = useCallback(() => {
    if (sigRef.current?.isEmpty()) {
      setSignatureError(t("owner_application_form.error_signature_required"));
      return false;
    }
    setSignatureError(null);
    return true;
  }, [t]);

  const onSubmit = useCallback(
    async (data) => {

      const isSignatureValid = validateSignature();
      const areFilesValid = validateFiles();

      if (!isSignatureValid || !areFilesValid) return;

      if (!imageFile) {
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
          profile_picture: imageFile, // Add this line
          id_document: idProofFile,
          paystubs: paystubFiles,
          is_currently_employed: data.is_currently_employed == true ? 1 : 0,
          has_pets: data.has_pets == true ? 1 : 0,
          evicted: data.evicted == true ? 1 : 0,
          convicted_felony: data.convicted_felony == true ? 1 : 0,
          declared_bankruptcy: data.declared_bankruptcy == true ? 1 : 0,
          terms_and_conditions: data.terms_and_conditions ? 1 : 0,
          preferred_move_in_date: data.preferred_move_in_date
            ? new Date(data.preferred_move_in_date).toISOString().split("T")[0]
            : null,
        };

        const formData = objectToFormData(submissionData);

        // Log the original object instead
        console.log("submissionData:", submissionData);

        const response = await createTenant(formData).unwrap();
        if (response?.success) {
          router.push("/tenant");
        }

        // Reset
        reset();
        setIdProofFile(null);
        setPaystubFiles([]);
        clearSignature();
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
    [
      validateSignature,
      validateFiles,
      imageFile,
      idProofFile,
      paystubFiles,
      reset,
      clearSignature,
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
    setValue("current_employer", null);
    setValue("employment_duration", null);
    setValue("total_monthly_salary", null);
  }
}, [watch("is_currently_employed")]);

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
        Tenant Application Form
      </h1>

      <h2 className="text-lg font-medium text-dark border-subheadline">
        Tenant Details
      </h2>

      {/* Image Upload Preview */}
      <div className="relative mb-4  max-w-46 w-full">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="profile"
            width={100}
            height={100}
            className="object-cover min-h-46 max-h-46 rounded-3xl w-full"
          />
        ) : (
          <div className="bg-[#E19CED] rounded-3xl min-h-46 h-full flex items-center justify-center overflow-hidden">
            <Image
              src="/profile.svg"
              alt="profile"
              width={72}
              height={72}
              className="object-cover mx-auto"
            />
          </div>
        )}

        {/* Trigger Button */}
        <div
          className="absolute -bottom-3 -right-2 cursor-pointer"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <Image
            src="/profile-camera.svg"
            alt="profile-camera"
            width={65}
            height={65}
            className="object-cover"
          />
        </div>

        {/* Hidden file input */}
        <input
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
          className="hidden"
        />
      </div>

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

        {idProofFile && (
          <FilePreview
            file={idProofFile}
            onRemove={() => setIdProofFile(null)}
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
          <p className="text-sm text-gray-600 mb-2">
            Please attach your most recent paystubs here:
          </p>
          <FileDropzone
            file={paystubFiles}
            onDrop={handlePaystubUpload}
            error={paystubError}
            accept={{ "application/pdf": [], "image/*": [] }}
            maxSize={10 * 1024 * 1024}
            multiple={true}
            maxFiles={3}
          />

          {paystubFiles.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onRemove={() => handleRemoveFile(index)}
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

      {/* Terms and Agreement Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-dark border-b border-subheadline pb-2">
          Terms and Agreement
        </h2>

        <div className="leading-relaxed my-4">
          <p className="mb-4 font-medium">
            By submitting this application, I acknowledge and agree that:
          </p>{" "}
          <ol className="list-inside">
            <li className="mb-2">
              {" "}
              1) The information provided herein is complete and accurate.
              Providing incomplete and/or false information could result in the
              rejection of the application.
            </li>
            <li>
              {" "}
              2) Submission of this application does not guarantee a room lease,
              which is reserved only upon signing of a completed lease agreement
              by all parties. Additionally, no other agreements, either written
              or oral, are binding on applicant, owner or owner's agents until
              the completed lease agreement is signed by all parties.
            </li>
            <li>
              {" "}
              3) Additional information may be required in order to process your
              application. Our management team will contact you upon receipt of
              this online application to obtain any additional information
              necessary to complete the processing of your application.
            </li>
          </ol>
        </div>

        <div className="flex items-start gap-3">
          <Controller
            name="terms_and_conditions"
            control={control}
            render={({ field }) => (
              <CustomCheckbox
                id="terms_and_conditions"
                label={
                  <span className="text-sm text-formlable">
                    I have read and agree to the terms and conditions above
                  </span>
                }
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>
        {errors.terms_and_conditions && (
          <p className="text-sm text-red-500">
            {errors.terms_and_conditions.message}
          </p>
        )}
      </section>

      {/* Signature Section */}
      <section className="space-y-4">
        <SignatureField
          label="Digital Signature"
          sigRef={sigRef}
          signatureError={signatureError}
          onClear={clearSignature}
        />
      </section>

      {/* Submit Button */}
      <div className="max-w-[350px] w-full mx-auto mt-12">
        <Button
          title={"Submit Application"}
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default TenantApplicationForm;
