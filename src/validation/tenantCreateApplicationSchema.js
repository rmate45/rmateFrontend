import * as yup from "yup";

// Improved validation schema with better error messages
export const tenantCreateValidationSchema = (t) =>
  yup.object().shape({
    first_name: yup
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .required("First name is required"),
    last_name: yup
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .required("Last name is required"),
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address")
      .required("Email is required"),
    phone_number: yup
      .string()
      .trim()
      .matches(
        /^[\+]?[(]?[\d\s\-\(\)]{10,}$/,
        "Please enter a valid phone number"
      )
      .required("Phone number is required"),
    address_line_1: yup
      .string()
      .trim()
      .min(5, "Street address must be at least 5 characters")
      .required("Street address is required"),
    address_line_2: yup.string().trim(),
    city: yup
      .string()
      .trim()
      .min(2, "City must be at least 2 characters")
      .required("City is required"),
    state: yup
      .string()
      .trim()
      .min(2, "State must be at least 2 characters")
      .required("State is required"),
    postal_code: yup
      .string()
      .trim()
      .matches(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code")
      .required("ZIP code is required"),
    is_currently_employed: yup
      .boolean()
      .nullable()
      .required("Please specify your employment status"),

    current_employer: yup.string().when("is_currently_employed", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .min(2, "Current employer must be at least 2 characters")
          .required("Current employer is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    employment_duration: yup.string().when("is_currently_employed", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .min(2, "Employment duration is too short")
          .required("Length of employment is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    total_monthly_salary: yup.number().when("is_currently_employed", {
      is: true,
      then: (schema) =>
        schema
          .positive("Salary must be a positive number")
          .min(100, "Salary must be at least $100")
          .max(1000000, "Salary seems too high")
          .required("Monthly salary is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    terms_and_conditions: yup
      .boolean()
      .oneOf([true], "You must accept the terms and conditions"),
    preferred_move_in_date: yup
      .date()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      })
      .nullable()
      .required("Move-in date is required"),
    has_pets: yup
      .boolean()
      .nullable()
      .required("Please specify if you have pets"),
    evicted: yup
      .boolean()
      .nullable()
      .required("Please answer the eviction question"),
    convicted_felony: yup
      .boolean()
      .nullable()
      .required("Please answer the felony question"),
    declared_bankruptcy: yup
      .boolean()
      .nullable()
      .required("Please answer the bankruptcy question"),
    landlord_phone_number: yup
      .string()
      .trim()
      .matches(
        /^[\+]?[(]?[\d\s\-\(\)]{10,}$/,
        "Please enter a valid phone number"
      )
      .required("Landlord phone number is required"),
    legal_history_explanation: yup.string().trim().nullable(),
    landlord_first_name: yup
      .string()
      .trim()
      .min(2, "Landlord's first name must be at least 2 characters")
      .required("Landlord's first name is required"),
    landlord_last_name: yup
      .string()
      .trim()
      .min(2, "Landlord's last name must be at least 2 characters")
      .required("Landlord's last name is required"),
  });
