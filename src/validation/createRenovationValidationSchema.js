import * as yup from "yup";

export const createRenovationValidationSchema = (t) =>
  yup.object().shape({
    renovationType: yup.string().trim().required("Required"),
    renovationDate: yup.string().required("Renovation date is required"),
    contractorName: yup.string().required("Contractor name is required"),
    renovationCost: yup
      .number()
      .typeError("Cost must be a number")
      .positive("Must be positive")
      .required("Required"),
    renovatedAreas: yup.string().required("Renovated areas are required"),
    permitRequired: yup
      .boolean()
      .nullable()
      .required("Permit required field is required"),
    permitNumber: yup.number().when("permitRequired", {
      is: true,
      then: yup.number().required("Permit number is required"),
      otherwise: yup.number().nullable().notRequired(),
    }),
  });
