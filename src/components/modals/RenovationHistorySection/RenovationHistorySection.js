"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";

import FileDropzone from "@/components/form/FileDropzone/FileDropzone";
import FormLable from "@/components/form/FormLable/FormLable";
import Input from "@/components/form/Input/Input";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import TextArea from "@/components/form/TextArea/TextArea";
import Button from "@/components/shared/Button/Button";
import { createRenovationValidationSchema } from "@/validation/createRenovationValidationSchema";
import DateInput from "@/components/form/DateInput/DateInput";
import FilePreview from "@/components/form/FilePreview/FilePreview";

export const RenovationHistorySection = ({
  onClose,
  onSaveRenovation,
  defaultValues = {},
}) => {
  const { t } = useTranslation();
  const schema = createRenovationValidationSchema(t);
  const [renovationDocuments, setRenovationDocuments] = useState(
    defaultValues?.documents || []
  );
  const [documentError, setDocumentError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      renovationType: "",
      renovationDate: "",
      contractorName: "",
      renovationCost: "",
      renovatedAreas: "",
      permitRequired: "",
      permitNumber: "",
      // Remove documents from defaultValues since we're handling it with state
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset(defaultValues);
    setRenovationDocuments(defaultValues?.documents || []);
  }, [defaultValues, reset]);

  const onSubmit = (data) => {
    // Validate documents using state before submitting
    if (renovationDocuments.length === 0) {
      setDocumentError("Please upload at least one document");
      return;
    }

    // Clear any existing document errors
    setDocumentError(null);

    console.log(data);
    onSaveRenovation({ ...data, documents: renovationDocuments });
    onClose();
  };

  console.log(errors);

  const handleRenovationUpload = useCallback(
    (acceptedFiles) => {
      const newFiles = [
        ...renovationDocuments,
        ...acceptedFiles.filter(
          (file) =>
            !renovationDocuments.some(
              (existing) =>
                existing.name === file.name && existing.size === file.size
            )
        ),
      ];
      if (newFiles.length > 5) {
        setDocumentError(
          t("renovationHistory.validation.max_files") ||
            "You can upload a maximum of 5 documents"
        );
        return;
      }
      setRenovationDocuments(newFiles);
      setDocumentError(null); // Clear error when files are uploaded
    },
    [renovationDocuments, t]
  );

  const handleRemoveRenovationFile = (indexToRemove) => {
    setRenovationDocuments((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove);
      return newFiles;
    });
  };

  const yesNoOptions = useMemo(
    () => [
      { label: t("admin_form.yes"), value: true },
      { label: t("admin_form.no"), value: false },
    ],
    [t]
  );

  return (
    <>
      <h2 className="text-lg font-medium text-dark border-subheadline mb-8">
        {t("renovationHistory.title")}
      </h2>

      <div className="space-y-4 mt-4">
        <div className="flex gap-6">
          <div className="w-full">
            <FormLable>
              {t("renovationHistory.fields.renovationType.label")}
            </FormLable>
            <Input
              {...register("renovationType")}
              placeholder={t(
                "renovationHistory.fields.renovationType.placeholder"
              )}
              error={errors.renovationType?.message}
            />
          </div>
          <div className="w-full">
            <FormLable>
              {t("renovationHistory.fields.renovationDate.label")}
            </FormLable>
            <DateInput
              {...register("renovationDate")}
              placeholder="Select a date"
              error={errors.renovationDate?.message}
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-full">
            <FormLable>
              {t("renovationHistory.fields.contractorName.label")}
            </FormLable>
            <Input
              {...register("contractorName")}
              placeholder={t(
                "renovationHistory.fields.contractorName.placeholder"
              )}
              error={errors.contractorName?.message}
            />
          </div>
          <div className="w-full">
            <FormLable>
              {t("renovationHistory.fields.renovationCost.label")}
            </FormLable>
            <Input
              {...register("renovationCost")}
              placeholder={t(
                "renovationHistory.fields.renovationCost.placeholder"
              )}
              type="number"
              min="0"
              step="1"
              error={errors.renovationCost?.message}
            />
          </div>
        </div>

        <div className="w-full">
          <FormLable>
            {t("renovationHistory.fields.renovatedAreas.label")}
          </FormLable>
          <TextArea
            {...register("renovatedAreas")}
            placeholder={t(
              "renovationHistory.fields.renovatedAreas.placeholder"
            )}
            error={errors.renovatedAreas?.message}
          />
        </div>

        <div className="flex flex-col">
          <Controller
            name="permitRequired"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label={t("renovationHistory.fields.permitRequired.label")}
                name="haspermit"
                value={field.value}
                options={yesNoOptions}
                onChange={field.onChange}
                error={errors.permitRequired}
              />
            )}
          />

          {watch("permitRequired") === true && (
            <div className="w-full max-w-1/2 pr-3 mt-2">
              <FormLable>
                {t("renovationHistory.fields.permitNumber.label")}
              </FormLable>
              <Input
                {...register("permitNumber")}
                placeholder={t(
                  "renovationHistory.fields.permitNumber.placeholder"
                )}
                type="number"
                min="0"
                step="1"
                error={errors.permitNumber?.message}
              />
            </div>
          )}
        </div>

        <div className="w-full">
          <FormLable>{t("renovationHistory.fields.documents.label")}</FormLable>
          <FileDropzone
            file={renovationDocuments}
            onDrop={handleRenovationUpload}
            error={documentError} // Use state error instead of Yup error
            accept={{ "application/pdf": [], "image/*": [] }}
            maxSize={10 * 1024 * 1024}
            multiple={true}
            maxFiles={5}
          />

          {renovationDocuments.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onRemove={() => handleRemoveRenovationFile(index)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            title={t("common.cancel")}
            variant="secondary"
            onClick={onClose}
          />
          <Button
            type="submit"
            title={t("common.save")}
            className="min-w-[90px]"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </>
  );
};
