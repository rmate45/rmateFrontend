import * as yup from "yup";

export const editAdminSchema = (t) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required(t("admin_form.validation.first_name_required")),
    lastName: yup
      .string()
      .required(t("admin_form.validation.last_name_required")),
    email: yup
      .string()
      .email(t("admin_form.validation.email_invalid"))
      .required(t("admin_form.validation.email_required")),
    phone: yup.string().required(t("admin_form.validation.phone_required")),
    jobTitle: yup
      .string()
      .required(t("admin_form.validation.job_title_required")),
    external: yup
      .boolean()
      .required(t("admin_form.validation.external_required")),
  });
