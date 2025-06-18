"use client";
import DateInput from "@/components/form/DateInput/DateInput";
import Dropdown from "@/components/form/Dropdown/Dropdown";
import FileDropzone from "@/components/form/FileDropzone/FileDropzone";
import FilePreview from "@/components/form/FilePreview/FilePreview";
import FormLable from "@/components/form/FormLable/FormLable";
import Input from "@/components/form/Input/Input";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import SignatureField from "@/components/form/SignatureField/SignatureField";
import TextArea from "@/components/form/TextArea/TextArea";
import { HoaAmenitiesModal } from "@/components/modals/HoaAmenitiesModal/HoaAmenitiesModal";
import { InsuranceServicesModal } from "@/components/modals/InsuranceServicesModal/InsuranceServicesModal";
import { RenovationHistorySection } from "@/components/modals/RenovationHistorySection/RenovationHistorySection";
import Button from "@/components/shared/Button/Button";
import CustomCheckbox from "@/components/shared/CustomCheckbox/CustomCheckbox";
import Modal from "@/components/shared/Modal/Modal";
import {
  useGetEnumsQuery,
  useGetPropertyCategoriesQuery,
} from "@/store/globalApi";
import clsx from "clsx";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { t } = useTranslation();
  const [isHoaModalOpen, setHoaModalOpen] = useState(false);
  const [isInsuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [isRenovationModalOpen, setRenovationModalOpen] = useState(false);
  const { data: enumsData, isLoading: isEnumLoading } = useGetEnumsQuery();
  const [hoaAmenities, setHoaAmenities] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [renovationList, setRenovationList] = useState([]);
  const [editRenovationIndex, setEditRenovationIndex] = useState(null);

  const { data: propertiesCategoriesData, isLoading } =
    useGetPropertyCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const propertyFormConstants = enumsData?.data || [];

  // Get the keys for the first dropdown
  const categoryOptions = propertiesCategoriesData
    ? Object.keys(propertiesCategoriesData.data).map((key) => ({
        label: key,
        value: key,
      }))
    : [];

  // Get the values for the second dropdown based on selected key
  const typeOptions =
    selectedCategory && propertiesCategoriesData.data?.[selectedCategory]
      ? propertiesCategoriesData.data[selectedCategory].map((item) => ({
          label: item,
          value: item,
        }))
      : [];

  const [featureImage, setFeatureImage] = useState(null);
  const [featureImageError, setFeatureImageError] = useState(null);

  const [floorPlanImages, setFloorPlanImages] = useState([]);
  const [flooPlanImagesError, setFloorPlanImagesError] = useState(null);

  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyImagesError, setPropertyImagesError] = useState(null);

  const [legalDocuments, setLegalDocuments] = useState([]);
  const [legalDocumentsError, setLegalDocumentsError] = useState(null);

  const handleIFeaturedImageUpload = useCallback((acceptedFiles) => {
    setFeatureImage(acceptedFiles[0]);
    setFeatureImageError(null);
  }, []);

  const handleFloorPlanUpload = useCallback(
    (acceptedFiles) => {
      const newFiles = [...floorPlanImages, ...acceptedFiles];

      setFloorPlanImages(newFiles);
      setFloorPlanImagesError(null);
    },
    [floorPlanImages]
  );

  const handleRemoveFloorImages = (indexToRemove) => {
    setFloorPlanImages((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handlePropertyImageUpload = useCallback(
    (acceptedFiles) => {
      const newFiles = [...propertyImages, ...acceptedFiles];
      setPropertyImages(newFiles);
      setPropertyImagesError(null);
    },
    [propertyImages]
  );

  const handleRemovePropertyImage = (indexToRemove) => {
    setPropertyImages((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleLegalDocumentUpload = useCallback(
    (acceptedFiles) => {
      const newFiles = [...legalDocuments, ...acceptedFiles];
      setLegalDocuments(newFiles);
      setLegalDocumentsError(null);
    },
    [legalDocuments]
  );

  const handleRemoveLegalDocument = (indexToRemove) => {
    setLegalDocuments((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const currentYear = new Date().getFullYear();

  const handleSaveRenovation = (data) => {
    setRenovationList((prev) => {
      if (editRenovationIndex !== null) {
        const updated = [...prev];
        updated[editRenovationIndex] = data;
        return updated;
      }
      return [...prev, data];
    });
  };

  return (
    <>
      <form
        className={clsx(
          "w-full bg-white p-10 rounded-md flex flex-col poppins text-formlable"
        )}
      >
        <h1 className="font-medium text-2xl md:text-[32px] text-dark mb-8">
          {t("property.title")}
        </h1>

        <h2 className="text-lg font-medium text-dark border-subheadline">
          {t("property.sections.propertyDetails.title")}
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <div>
            <FormLable>{t("property.fields.propertyName.label")}</FormLable>
            <Input
              placeholder={t("property.fields.propertyName.placeholder")}
              type="text"
              required
            />
          </div>

          <div>
            <FormLable>{t("property.fields.streetAddress1.label")}</FormLable>
            <Input
              placeholder={t("property.fields.streetAddress1.placeholder")}
              type="text"
              required
            />
          </div>

          <div>
            <FormLable>{t("property.fields.streetAddress2.label")}</FormLable>
            <Input
              placeholder={t("property.fields.streetAddress2.placeholder")}
              type="text"
            />
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.city.label")}</FormLable>
              <Input
                placeholder={t("property.fields.city.placeholder")}
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.stateProvince.label")}</FormLable>
              <Input
                placeholder={t("property.fields.stateProvince.placeholder")}
                type="text"
                required
              />
            </div>
          </div>

          <div>
            <FormLable>{t("property.fields.postalCode.label")}</FormLable>
            <Input
              placeholder={t("property.fields.postalCode.placeholder")}
              type="text"
              pattern="[0-9]{5}(-[0-9]{4})?"
              title="Please enter a valid postal code (e.g., 12345 or 12345-6789)"
              required
            />
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>
                {t("property.fields.propertyCategory.label")}
              </FormLable>
              <Dropdown
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedType(""); // reset type when category changes
                }}
                options={categoryOptions}
                placeholder="Select property category"
                required
              />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.propertyType.label")}</FormLable>
              <Dropdown
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={typeOptions}
                placeholder="Select property type"
                disabled={!selectedCategory}
                required
              />
            </div>
          </div>

          <div className="w-full">
            <FormLable>{t("property.fields.ownershipStatus.label")}</FormLable>
            <Dropdown
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedType(""); // reset type when category changes
              }}
              options={Object.keys(
                propertyFormConstants?.ownershipStatus || {}
              ).map((key) => ({
                label: key,
                value: key,
              }))}
              placeholder={t("property.fields.ownershipStatus.placeholder")}
              required
            />
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>
                {t("property.fields.acquisitionDate.label")}
              </FormLable>
              <DateInput placeholder="Select a date" required />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.listingStatus.label")}</FormLable>
              <Dropdown
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={Object.keys(
                  propertyFormConstants?.listingStatus || {}
                ).map((key) => ({
                  label: key,
                  value: key,
                }))}
                placeholder="Select listing type"
                required
              />
            </div>
          </div>
        </div>

        <h2 className="text-lg font-medium text-dark border-subheadline mt-8">
          {t("property.sections.physicalCharacteristics.title")}
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <div>
            <FormLable>{t("property.fields.lotSize.label")}</FormLable>
            <Input
              placeholder={t("property.fields.lotSize.placeholder")}
              type="number"
              min="0"
              step="0.01"
              title="Enter lot size in square feet or acres"
            />
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.bedrooms.label")}</FormLable>
              <Input
                placeholder={t("property.fields.bedrooms.placeholder")}
                type="number"
                min="0"
                max="20"
                step="1"
              />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.bathrooms.label")}</FormLable>
              <Input
                placeholder={t("property.fields.bathrooms.placeholder")}
                type="number"
                min="0"
                max="20"
                step="0.5"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.yearBuilt.label")}</FormLable>
              <Input
                type="number"
                placeholder={t("property.fields.yearBuilt.placeholder")}
                min={1800}
                max={currentYear}
                step={1}
              />
            </div>
            <div className="w-full">
              <FormLable>
                {t("property.fields.constructionType.label")}
              </FormLable>

              <Dropdown
                value={selectedCategory}
                onChange={(e) => {}}
                options={Object.keys(
                  propertyFormConstants?.constructionTypes || {}
                ).map((key) => ({
                  label: key,
                  value: key,
                }))}
                placeholder={t("property.fields.constructionType.placeholder")}
              />
            </div>
          </div>

          <div className="w-full max-w-1/2 pr-3">
            <div className="w-full">
              <FormLable>{t("property.fields.parking.label")}</FormLable>
              <Dropdown
                value={selectedCategory}
                onChange={(e) => {}}
                options={Object.keys(
                  propertyFormConstants?.parkingType || {}
                ).map((key) => ({
                  label: key,
                  value: key,
                }))}
                placeholder={t("property.fields.parking.placeholder")}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.featuredImage.label")}</FormLable>
              <FileDropzone
                accept={{ "image/*": [] }}
                maxSize={10 * 1024 * 1024} // 10MB
                multiple={false}
                maxFiles={1}
                onDrop={handleIFeaturedImageUpload}
                file={featureImage}
                error={featureImageError}
              />

              {featureImage && (
                <FilePreview
                  file={featureImage}
                  onRemove={() => setFeatureImage(null)}
                />
              )}
            </div>

            <div className="w-full">
              <FormLable>{t("property.fields.floorPlan.label")}</FormLable>
              <FileDropzone
                accept={{ "application/pdf": [], "image/*": [] }}
                maxSize={10 * 1024 * 1024} // 10MB
                multiple={true}
                maxFiles={3}
                onDrop={handleFloorPlanUpload}
                error={flooPlanImagesError}
              />

              {floorPlanImages?.map((file, index) => (
                <FilePreview
                  key={index}
                  file={file}
                  onRemove={() => handleRemoveFloorImages(index)}
                />
              ))}
            </div>
          </div>

          <div className="w-full">
            <FormLable>{t("property.fields.propertyImages.label")}</FormLable>
            <FileDropzone
              accept={{ "image/*": [] }}
              maxSize={10 * 1024 * 1024}
              multiple={true}
              maxFiles={5}
              onDrop={handlePropertyImageUpload}
              error={propertyImagesError}
            />
            {propertyImages.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemovePropertyImage(index)}
              />
            ))}
          </div>
        </div>

        <h2 className="text-lg font-medium text-dark border-subheadline mt-8">
          {t("property.sections.financialLegal.title")}
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.marketValue.label")}</FormLable>
              <Input
                placeholder={t("property.fields.marketValue.placeholder")}
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.assessedValue.label")}</FormLable>
              <Input
                placeholder={t("property.fields.assessedValue.placeholder")}
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.monthlyRent.label")}</FormLable>
              <Input
                placeholder={t("property.fields.monthlyRent.placeholder")}
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.propertyTaxes.label")}</FormLable>
              <Input
                placeholder={t("property.fields.propertyTaxes.placeholder")}
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <FormLable>{t("property.fields.hoaAmenities.label")}</FormLable>

            <div className="p-4 border-[#7D7D7D] border-2 border-dashed rounded-md space-y-4">
              {hoaAmenities.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {hoaAmenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#D2D4D633] p-3 rounded-md text-sm"
                    >
                      <span>
                        {amenity.name} – ${amenity.price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}

              {hoaAmenities.length > 0 ? (
                <Button
                  iconSrc="/edit-white.svg"
                  title="Edit HOA"
                  onClick={() => setHoaModalOpen(true)}
                />
              ) : (
                <Button
                  iconSrc="/plus-white.svg"
                  title={t("property.buttons.addHoa")}
                  onClick={() => setHoaModalOpen(true)}
                />
              )}
            </div>
          </div>

          <div>
            <FormLable>
              {t("property.fields.propertyInsurance.label")}
            </FormLable>
            <div className="p-4 border-[#7D7D7D] border-2 border-dashed rounded-md space-y-4">
              {insurances.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {insurances.map((insurance, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#D2D4D633] p-3 rounded-md text-sm"
                    >
                      <span>
                        {insurance.name} – ${insurance.price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}

              {insurances.length > 0 ? (
                <Button
                  iconSrc="/edit-white.svg"
                  title="Edit Insurances"
                  onClick={() => setInsuranceModalOpen(true)}
                />
              ) : (
                <Button
                  iconSrc="/plus-white.svg"
                  title={t("property.buttons.addInsurance")}
                  onClick={() => setInsuranceModalOpen(true)}
                />
              )}
            </div>
          </div>

          <div className="w-full max-w-1/2 pr-3">
            <FormLable>{t("property.fields.zoning.label")}</FormLable>
            <Input
              placeholder={t("property.fields.zoning.placeholder")}
              type="text"
            />
          </div>

          <div className="w-full">
            <FormLable>{t("property.fields.legalDocuments.label")}</FormLable>
            <FileDropzone
              accept={{ "application/pdf": [], "image/*": [] }}
              maxSize={10 * 1024 * 1024}
              multiple={true}
              maxFiles={5}
              onDrop={handleLegalDocumentUpload}
              error={legalDocumentsError}
            />
            {legalDocuments.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemoveLegalDocument(index)}
              />
            ))}
          </div>
        </div>

        <h2 className="text-lg font-medium text-dark border-subheadline mt-8">
          {t("property.sections.conditionFeatures.title")}
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <div className="w-full max-w-1/2 pr-3">
            <FormLable>{t("property.fields.condition.label")}</FormLable>
            <Input
              placeholder={t("property.fields.condition.placeholder")}
              type="text"
            />
          </div>

          <div>
            <FormLable>
              {t("property.fields.appliancesIncluded.label")}
            </FormLable>
            <TextArea
              placeholder={t("property.fields.appliancesIncluded.placeholder")}
              type="text"
            />
          </div>

          <div className="w-full space-y-4">
            <FormLable>
              {t("property.fields.renovationHistory.label")}
            </FormLable>

            {renovationList.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-md px-4 py-2 flex justify-between items-center"
              >
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">{item.renovationType}</span>
                  <span className=" text-gray-500">
                    ({item.contractorName})
                  </span>
                </div>
                <Button
                  iconSrc="/edit-white.svg"
                  size="sm"
                  onClick={() => {
                    setEditRenovationIndex(index);
                    setRenovationModalOpen(true);
                  }}
                />
              </div>
            ))}

            <div className="p-4 border-[#7D7D7D] border-2 border-dashed">
              <Button
                iconSrc="/plus-white.svg"
                title={t("property.buttons.addRenovationHistory")}
                onClick={() => {
                  setEditRenovationIndex(null);
                  setRenovationModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-lg font-medium text-dark border-subheadline mt-8">
          {t("property.sections.listing.title")}
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>
                {t("property.fields.availabilityDate.label")}
              </FormLable>
              <DateInput placeholder="Select a date" />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.leaseTerm.label")}</FormLable>
              <Input
                placeholder={t("property.fields.leaseTerm.placeholder")}
                type="number"
                min="1"
                max="60"
                step="1"
                title="Enter lease term in months"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.depositAmount.label")}</FormLable>
              <Input
                placeholder={t("property.fields.depositAmount.placeholder")}
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-full">
              <RadioGroup
                label={t("property.fields.allowPets.label")}
                name="hasPets"
                options={[
                  { label: t("common.yes"), value: "yes" },
                  { label: t("common.no"), value: "no" },
                ]}
              />
            </div>
          </div>

          <div className="w-full">
            <FormLable>
              {t("property.fields.propertyDescription.label")}
            </FormLable>
            <TextArea
              placeholder={t("property.fields.propertyDescription.placeholder")}
              type="text"
              required
            />
          </div>

          <div className="w-full max-w-1/2 pr-3">
            <FormLable>{t("property.fields.applicationFee.label")}</FormLable>
            <Input
              placeholder={t("property.fields.applicationFee.placeholder")}
              type="number"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <h2 className="text-lg font-medium text-dark border-subheadline mt-8">
          {t("property.sections.operationalMaintenance.title")}
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>{t("property.fields.managementFee.label")}</FormLable>
              <Input
                placeholder={t("property.fields.managementFee.placeholder")}
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-full">
              <FormLable>
                {t("property.fields.maintenanceContact.label")}
              </FormLable>
              <Input
                placeholder={t(
                  "property.fields.maintenanceContact.placeholder"
                )}
                type="tel"
                pattern="[0-9\-\+\s\(\)]+"
                title="Please enter a valid phone number"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <FormLable>
                {t("property.fields.lastInspectionDate.label")}
              </FormLable>
              <DateInput placeholder="Select a date" />
            </div>
            <div className="w-full">
              <FormLable>{t("property.fields.vacancyHistory.label")}</FormLable>
              <Input
                placeholder={t("property.fields.vacancyHistory.placeholder")}
                title="Enter number of days vacant"
              />
            </div>
          </div>
        </div>

        <h2 className="text-lg font-medium text-dark border-subheadline mt-8">
          {t("property.sections.customizable.title")}
        </h2>

        <div className="flex flex-col gap-4 mt-6">
          <div className="w-full">
            <FormLable>{t("property.fields.customTags.label")}</FormLable>
            <Input
              placeholder={t("property.fields.customTags.placeholder")}
              type="text"
            />
          </div>

          <div className="w-full">
            <FormLable>{t("property.fields.addNote.label")}</FormLable>
            <TextArea
              placeholder={t("property.fields.addNote.placeholder")}
              type="text"
            />
          </div>
        </div>

        <section className="space-y-4 mt-4">
          <h2 className="text-lg font-medium text-dark border-b border-subheadline pb-2">
            {t("property.sections.termsAgreement.title")}
          </h2>

          <div className="leading-relaxed my-4">
            <p className="mb-4 font-medium">
              {t("property.sections.termsAgreement.intro")}
            </p>
            <ol className="list-inside">
              <li className="mb-2">
                {t("property.sections.termsAgreement.term1")}
              </li>
              <li className="mb-2">
                {t("property.sections.termsAgreement.term2")}
              </li>
              <li>{t("property.sections.termsAgreement.term3")}</li>
            </ol>
          </div>

          <div className="flex items-start gap-3">
            <CustomCheckbox
              id="agreed"
              label={
                <span className="text-sm text-formlable">
                  {t("property.sections.termsAgreement.checkbox")}
                </span>
              }
              required
            />
          </div>
        </section>

        {/* Signature Section */}
        <section className="space-y-4">
          <SignatureField
            label={t("property.fields.digitalSignature.label")}
            required
          />
        </section>

        {/* Submit Button */}
        <div className="max-w-sm mx-auto pt-6">
          <Button
            title={t("property.buttons.submitApplication")}
            type="submit"
          />
        </div>
      </form>

      <div>
        <Modal isOpen={isHoaModalOpen} onClose={() => setHoaModalOpen(false)}>
          <HoaAmenitiesModal
            initialAmenities={hoaAmenities}
            onClose={() => setHoaModalOpen(false)}
            onSaveAmenities={(data) => {
              setHoaAmenities(data);
              setHoaModalOpen(false);
            }}
          />
        </Modal>

        <Modal
          isOpen={isInsuranceModalOpen}
          onClose={() => setInsuranceModalOpen(false)}
        >
          <InsuranceServicesModal
            initialInsurance={insurances}
            onClose={() => setInsuranceModalOpen(false)}
            onSaveInsurance={(data) => {
              setInsurances(data);
              setInsuranceModalOpen(false);
            }}
          />
        </Modal>

        <Modal
          isOpen={isRenovationModalOpen}
          onClose={() => setRenovationModalOpen(false)}
        >
          <RenovationHistorySection
            onClose={() => {
              setRenovationModalOpen(false);
              setEditRenovationIndex(null);
            }}
            onSaveRenovation={handleSaveRenovation}
            defaultValues={
              editRenovationIndex !== null
                ? renovationList[editRenovationIndex]
                : {}
            }
          />
        </Modal>
      </div>
    </>
  );
};

export default Page;
