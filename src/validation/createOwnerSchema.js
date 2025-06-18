import * as yup from "yup";

export const createOwnerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  streetAddress: yup.string().required("Street address is required"),
  streetAddress2: yup.string(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Postal / Zip Code is required"),
  agreed: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});
